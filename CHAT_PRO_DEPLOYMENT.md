# NSEinsider Chat Pro - Deployment Guide

## Overview

This guide covers deploying the AI-powered investment advisor chatbot with Paystack subscription billing (KES 500/month).

## Prerequisites

- Paystack account (you already have this)
- Cloudflare Workers (nse-bot-backend already deployed)
- Vercel (astro-blog-suite already deployed)

## Step 1: Configure Paystack

### 1.1 Create a Subscription Plan in Paystack Dashboard

1. Log into your Paystack dashboard: https://dashboard.paystack.com
2. Go to **Subscriptions** → **Plans** → **Create Plan**
3. Fill in:
   - **Name**: NSEinsider Chat Pro
   - **Amount**: 500
   - **Currency**: KES
   - **Interval**: Monthly
   - **Invoice Limit**: 0 (unlimited renewals)
4. Click **Create Plan**
5. Copy the **Plan Code** (looks like `PLN_xxxxxxxx`)

### 1.2 Get Your API Keys

1. Go to **Settings** → **API Keys & Webhooks**
2. Copy your **Secret Key** (starts with `sk_live_` for production, `sk_test_` for testing)
3. Copy your **Public Key** (starts with `pk_live_` or `pk_test_`)

### 1.3 Set Up Webhook (after backend deployment)

1. Go to **Settings** → **API Keys & Webhooks** → **Webhooks**
2. Click **Add Webhook**
3. Enter URL: `https://nse-bot-backend.karanidevops.workers.dev/payments/paystack/webhook`
4. Select events:
   - `charge.success`
   - `subscription.create`
   - `subscription.disable`
   - `subscription.enable`
   - `invoice.failed`
5. Save the webhook

## Step 2: Configure Backend (Cloudflare Worker)

### 2.1 Set Secrets

Run these commands in your terminal from the `nse-bot-backend` directory:

```bash
# Paystack Secret Key (from Step 1.2)
wrangler secret put PAYSTACK_SECRET_KEY
# Paste your sk_live_xxxxx key when prompted

# Paystack Public Key (from Step 1.2)
wrangler secret put PAYSTACK_PUBLIC_KEY
# Paste your pk_live_xxxxx key when prompted

# Paystack Plan ID (from Step 1.1)
wrangler secret put PAYSTACK_PLAN_ID
# Paste your PLN_xxxxx plan code when prompted

# Optional: Webhook secret for signature verification
wrangler secret put PAYSTACK_WEBHOOK_SECRET
# Generate a random 32-char string or use: openssl rand -hex 32
```

### 2.2 Initialize Database Tables

The tables are auto-created when payment endpoints are first called, but you can also run the schema manually:

```bash
# Option 1: Tables auto-create on first payment API call

# Option 2: Run schema manually via D1 console
wrangler d1 execute finance-bot-db --file=src/db/schema.sql
```

### 2.3 Deploy the Worker

```bash
cd /home/karaniph/nse-bot-backend
npm run deploy
# or: wrangler deploy
```

### 2.4 Verify Endpoints

Test the health check:

```bash
curl https://nse-bot-backend.karanidevops.workers.dev/healthz
```

Test payment status (should return "No active subscription"):

```bash
curl "https://nse-bot-backend.karanidevops.workers.dev/payments/paystack/status?chat_token=test-invalid"
```

## Step 3: Configure Frontend (Astro)

### 3.1 Environment Variables (Optional)

The frontend defaults to the production Worker URL. To override:

```bash
cd /home/karaniph/Desktop/astro-blog-suite

# Create .env file
echo "VITE_CHAT_API_BASE=https://nse-bot-backend.karanidevops.workers.dev" > .env
```

### 3.2 Deploy to Vercel

```bash
cd /home/karaniph/Desktop/astro-blog-suite
npm run build
# Vercel will auto-deploy from GitHub, or use:
# vercel --prod
```

## Step 4: Complete Paystack Webhook Setup

After both backend and frontend are deployed:

1. Go back to Paystack Dashboard → Settings → Webhooks
2. Ensure the webhook URL is set: `https://nse-bot-backend.karanidevops.workers.dev/payments/paystack/webhook`
3. If you set `PAYSTACK_WEBHOOK_SECRET`, Paystack will sign webhooks with HMAC-SHA512

## Step 5: Test the Full Flow

### 5.1 Test Payment Flow (Use Paystack Test Mode First)

1. Switch Paystack to **Test Mode** (toggle in dashboard header)
2. Create a test plan with the same setup but in test mode
3. Use test secret/public keys (`sk_test_`, `pk_test_`)
4. Visit your site and click the chat button
5. Enter a test email (e.g., `test@example.com`)
6. Click "Subscribe with Paystack"
7. On Paystack checkout, use test card:
   - Card number: `408 408 408 408 408 1`
   - Expiry: Any future date
   - CVV: `408`
   - PIN: `1234`
8. Complete payment
9. You should be redirected back to your site with chat access

### 5.2 Test Chat Flow

1. After successful payment, the chat UI should appear
2. Try a message: "I have KES 10,000 to invest, what should I buy?"
3. The AI should respond with investment suggestions based on your risk profile

### 5.3 Verify Subscription Status

```bash
# Get your chat_token from browser localStorage (nse_chat_token)
curl "https://nse-bot-backend.karanidevops.workers.dev/payments/paystack/status?chat_token=YOUR_TOKEN"
```

## Production Checklist

Before going live:

- [ ] Switch Paystack to **Live Mode**
- [ ] Update secrets with live keys (`sk_live_`, `pk_live_`)
- [ ] Update `PAYSTACK_PLAN_ID` to the live plan code
- [ ] Test with a real payment (you can cancel after)
- [ ] Monitor Worker logs: `wrangler tail`

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│ astro-blog-suite (Vercel - Static Astro Site)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ChatWidget.tsx (React Island)                            │  │
│  │  - Floating chat button (bottom-right)                   │  │
│  │  - Paywall modal (email input → Paystack redirect)       │  │
│  │  - Chat UI (message list + input)                        │  │
│  │  - localStorage token persistence                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ nse-bot-backend (Cloudflare Worker)                            │
│                                                                 │
│  Payment Endpoints:                                            │
│  - POST /payments/paystack/initialize → Paystack checkout     │
│  - POST /payments/paystack/webhook   → Payment confirmation   │
│  - GET  /payments/paystack/status    → Subscription status    │
│  - GET  /payments/paystack/callback  → Redirect after payment │
│                                                                 │
│  Chat Endpoints:                                               │
│  - POST /chat/message  → Send message, get AI response        │
│  - GET  /chat/history  → Load conversation history            │
│  - POST /chat/profile  → Update risk level/horizon            │
│                                                                 │
│  D1 Tables:                                                    │
│  - user_accounts       (email, chat_token)                    │
│  - subscriptions       (Paystack subscription, status)        │
│  - chat_sessions       (risk_level, horizon_months)           │
│  - chat_messages       (conversation history)                 │
│  - paystack_transactions (payment log)                        │
│                                                                 │
│  Reused from existing code:                                    │
│  - src/commands/ask.ts  (budget parsing, AI calls)            │
│  - src/utils/ai.ts      (Vercel AI Gateway + Mistral)         │
│  - D1 database with NSE filings, events, blog posts           │
└─────────────────────────────────────────────────────────────────┘
```

## Pricing Details

- **Plan**: KES 500/month (~$3.85 USD)
- **Message cap**: 100 messages/month per subscriber
- **Paystack fee**: ~KES 10-15 per transaction (varies)
- **AI cost**: ~$0.01-0.02 per chat session (Vercel AI Gateway gpt-5-nano)

## Troubleshooting

### Payment not working
1. Check Worker logs: `wrangler tail`
2. Verify secrets are set: `wrangler secret list`
3. Test Paystack webhook delivery in dashboard

### Chat not responding
1. Check `AI_GATEWAY_API_KEY` is set
2. Check subscription status endpoint returns `"active": true`
3. Check message cap not exceeded

### Token not saved
1. Check browser localStorage for `nse_chat_token`
2. Clear localStorage and re-initialize payment
3. Verify payment callback URL includes `?payment=success`

## Files Changed

### Backend (nse-bot-backend)
- `src/db/schema.sql` - Added payment/chat tables
- `src/db/payments.ts` - New payment DB queries
- `src/payments/paystack.ts` - Paystack integration
- `src/chat/handler.ts` - Chat endpoints
- `src/index.ts` - Added routes for payment/chat
- `src/types.ts` - Added Env types
- `wrangler.toml` - Added secret documentation

### Frontend (astro-blog-suite)
- `src/components/ChatWidget.tsx` - New chat UI component
- `src/components/AppShell.tsx` - Added ChatButton
- `.env.example` - Added VITE_CHAT_API_BASE
