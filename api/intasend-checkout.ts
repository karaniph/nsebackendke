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
  email?: string;
  phone?: string;
  reference?: string;
  redirectUrl?: string;
}

function json(res: any, status: number, data: unknown) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
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

  const email = (body.email || "").trim().toLowerCase();
  const reference = (body.reference || "").trim();
  const redirectUrl = (body.redirectUrl || "").trim();
  if (!email || !reference || !redirectUrl) {
    return json(res, 400, { ok: false, error: "email, reference, and redirectUrl are required" });
  }

  const baseUrl = publicKey.includes("_test_")
    ? "https://sandbox.intasend.com"
    : "https://api.intasend.com";

  try {
    const upstream = await fetch(`${baseUrl}/api/v1/checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-IntaSend-Public-API-Key": publicKey,
      },
      body: JSON.stringify({
        email,
        phone_number: body.phone,
        country: "KE",
        amount: "500",
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
