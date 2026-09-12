// Vercel serverless function that relays checkout creation to IntaSend.
//
// Why this exists: IntaSend's edge (Cloudflare-fronted) rejects requests
// originating from Cloudflare Workers with HTTP 403 "error code: 1106" —
// this is IntaSend blocking Cloudflare's own IP ranges, not a credential or
// account problem. Vercel's serverless IPs are not blocked, so this function
// runs on Vercel and makes the actual call to IntaSend on the Worker's
// behalf. The Worker calls this endpoint instead of calling IntaSend
// directly; nothing else about the payment flow changes.
//
// Auth: the Worker must send the shared secret in X-Relay-Secret. Without a
// valid secret this function refuses to run, since it is a public URL that
// would otherwise let anyone create arbitrary IntaSend checkouts under this
// account.
//
// No runtime config is set here: Vercel's default Node.js serverless runtime
// is what we want (the (req, res) handler signature below matches it), and
// leaving `config` out avoids depending on an exact runtime identifier string.

interface CheckoutRequestBody {
  action?: "create" | "status";
  email?: string;
  phone?: string;
  reference?: string;
  redirectUrl?: string;
  amount?: number;
  // Fields used only when action === "status".
  checkoutId?: string;
  signature?: string;
}

function json(res: any, status: number, data: unknown) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function getBaseUrl(publicKey: string): string {
  return publicKey.includes("_test_") ? "https://sandbox.intasend.com" : "https://api.intasend.com";
}

/**
 * Create a hosted checkout. See createIntaSendCheckout() in the Worker for
 * why this call is relayed through Vercel instead of made directly.
 */
async function createCheckout(publicKey: string, body: CheckoutRequestBody, res: any) {
  const email = (body.email || "").trim().toLowerCase();
  const reference = (body.reference || "").trim();
  const redirectUrl = (body.redirectUrl || "").trim();
  if (!email || !reference || !redirectUrl) {
    return json(res, 400, { ok: false, error: "email, reference, and redirectUrl are required" });
  }

  // The Worker is the source of truth for price; fall back to 500 only if it
  // omits the field so older callers keep working.
  const amount = Number.isFinite(body.amount) && (body.amount as number) > 0 ? String(body.amount) : "500";

  try {
    const upstream = await fetch(`${getBaseUrl(publicKey)}/api/v1/checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-IntaSend-Public-API-Key": publicKey,
      },
      body: JSON.stringify({
        email,
        phone_number: body.phone,
        country: "KE",
        amount,
        currency: "KES",
        api_ref: reference,
        host: process.env.SITE_BASE_URL || "https://nseinsider.co.ke",
        redirect_url: redirectUrl,
        mobile_tarrif: "BUSINESS-PAYS",
        card_tarrif: "BUSINESS-PAYS",
      }),
    });

    const text = await upstream.text();
    let result: { url?: string; invoice_id?: string; error?: string; message?: string } = {};
    try {
      result = JSON.parse(text);
    } catch {
      // Non-JSON body from IntaSend; fall through to the error branch below.
    }

    if (!upstream.ok || !result.url) {
      console.error("IntaSend checkout relay failed", {
        status: upstream.status,
        body: text.slice(0, 500),
      });
      return json(res, 502, {
        ok: false,
        error: result.error || result.message || `IntaSend checkout failed (HTTP ${upstream.status})`,
      });
    }

    return json(res, 200, { ok: true, checkoutUrl: result.url, invoiceId: result.invoice_id || "" });
  } catch (error) {
    console.error("IntaSend checkout relay error", error);
    return json(res, 502, { ok: false, error: "Failed to reach IntaSend from relay" });
  }
}

/**
 * Look up the real, current state of a checkout using the checkout_id and
 * signature IntaSend appends to the redirect_url query string.
 *
 * This exists because IntaSend's server-to-server webhook cannot be relied
 * on alone (in testing it never arrived at all for a completed payment), so
 * the Worker also checks status synchronously right when the customer is
 * bounced back after paying, using this endpoint as the source of truth.
 */
async function checkoutStatus(secretKey: string, publicKey: string, body: CheckoutRequestBody, res: any) {
  const checkoutId = (body.checkoutId || "").trim();
  const signature = (body.signature || "").trim();
  if (!checkoutId || !signature) {
    return json(res, 400, { ok: false, error: "checkoutId and signature are required" });
  }
  if (!secretKey) {
    return json(res, 500, { ok: false, error: "IntaSend secret key is not configured on Vercel" });
  }

  try {
    const upstream = await fetch(`${getBaseUrl(publicKey)}/api/v1/checkout/details/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({ checkout_id: checkoutId, signature }),
    });

    const text = await upstream.text();
    let result: {
      invoice?: {
        invoice_id?: string;
        state?: string;
        account?: string;
        api_ref?: string;
        value?: string;
        provider?: string;
      };
      error?: string;
      message?: string;
    } = {};
    try {
      result = JSON.parse(text);
    } catch {
      // Non-JSON body from IntaSend; fall through to the error branch below.
    }

    if (!upstream.ok || !result.invoice) {
      console.error("IntaSend checkout status relay failed", {
        status: upstream.status,
        body: text.slice(0, 500),
      });
      return json(res, 502, {
        ok: false,
        error: result.error || result.message || `IntaSend status check failed (HTTP ${upstream.status})`,
      });
    }

    return json(res, 200, {
      ok: true,
      invoiceId: result.invoice.invoice_id || "",
      state: result.invoice.state || "",
      email: result.invoice.account || "",
      apiRef: result.invoice.api_ref || "",
      provider: result.invoice.provider || "",
    });
  } catch (error) {
    console.error("IntaSend checkout status relay error", error);
    return json(res, 502, { ok: false, error: "Failed to reach IntaSend from relay" });
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const relaySecret = process.env.RELAY_SHARED_SECRET || "";
  const provided = req.headers["x-relay-secret"] || "";
  if (!relaySecret || provided !== relaySecret) {
    return json(res, 401, { ok: false, error: "Unauthorized" });
  }

  const publicKey = process.env.INTASEND_PUBLISHABLE_KEY || "";
  if (!publicKey) {
    return json(res, 500, { ok: false, error: "IntaSend publishable key is not configured on Vercel" });
  }

  let body: CheckoutRequestBody = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body" });
  }

  if (body.action === "status") {
    return checkoutStatus(process.env.INTASEND_SECRET_KEY || "", publicKey, body, res);
  }
  return createCheckout(publicKey, body, res);
}
