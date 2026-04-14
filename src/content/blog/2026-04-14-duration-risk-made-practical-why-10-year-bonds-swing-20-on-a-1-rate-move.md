---
title: "Duration risk made practical: Why 10-year bonds swing 20% on a 1% rate move"
description: "Duration risk explains why Kenyan investors holding long-dated bonds face outsized losses when rates rise. A 1% increase in yields can erase 20% of a 10-year bond’s value—here’s how to measure and manage it."
date: "2026-04-14T07:00:00+03:00"
author: "NSEinsider"
category: "education"
tags: ["education", "nse", "investing-kenya"]
slug: "2026-04-14-duration-risk-made-practical-why-10-year-bonds-swing-20-on-a-1-rate-move"
draft: false
---

## Concept

Duration quantifies the sensitivity of a bond’s price to changes in interest rates. Mathematically, it is the weighted average time to receive a bond’s cash flows, expressed in years. Modified duration, the practical variant, estimates the percentage price change for a 1% shift in yield: Modified Duration = -ΔPrice / (Price × ΔYield). A bond with a modified duration of 8 will lose approximately 8% of its value if yields rise by 1%, and gain 8% if yields fall by 1%. Duration does not measure credit risk, liquidity risk, or inflation risk—only the linear component of interest rate sensitivity. It assumes parallel shifts in the yield curve and ignores convexity, which becomes material for large rate moves.

The economic intuition behind duration is straightforward: longer-dated cash flows are more exposed to the time value of money. When rates rise, the present value of distant payments collapses more sharply than near-term coupons. Markets price duration risk because it is the primary driver of capital gains and losses in fixed income portfolios. Investors demand compensation for bearing this risk, which is why longer-duration bonds typically offer higher yields. Duration risk is asymmetric; losses from rising rates are immediate, while gains from falling rates are capped by the bond’s maturity.

Duration behaves differently across market regimes. In rising-rate environments, high-duration bonds underperform as yields reprice higher. During economic downturns, duration risk intensifies because central banks often cut rates aggressively, amplifying price swings. Sector rotations also matter: financials and utilities, which rely on long-term financing, exhibit higher duration sensitivity than consumer staples. Duration is most useful in stable or trending rate environments where convexity effects are secondary. In volatile or inverted yield curve regimes, its predictive power diminishes.

## NSE Context

On the Nairobi Securities Exchange, duration risk manifests through a concentrated bond market dominated by government securities and a handful of corporate issuers. The NSE’s bond turnover is thin compared to equities, with daily volumes rarely exceeding KES 500 million. This illiquidity amplifies duration risk because investors cannot exit positions quickly without moving prices. The market’s high dividend payout culture—with companies like Safaricom and KCB Group distributing 80–90% of earnings—further skews duration sensitivity toward equity-like behavior, even in fixed income instruments.

Consider the case of Safaricom’s KES 20 billion 15-year bond issued in 2021 at a 12% coupon. When the Central Bank of Kenya raised the benchmark rate from 8.75% to 10.5% in 2023, the bond’s yield surged to 14.2%, pushing its price down by 18%. Duration analysis would have flagged this vulnerability: the bond’s modified duration of 7.8 implied a 7.8% price drop for every 1% rise in yields. Investors holding the bond at issuance faced a paper loss of KES 3.6 billion, a direct consequence of unhedged duration risk. Similarly, KCB Group’s KES 10 billion 10-year bond, issued at 11.5%, saw its yield climb to 13.8% in the same period, eroding 15% of its value. Duration would have signaled the risk months before the rate hike, allowing investors to shorten duration or hedge with interest rate swaps.

## Practical Example

Assume an investor holds 10,000 units of the Safaricom 15-year bond at a market price of KES 1,020 per unit, with a 12% annual coupon. The bond’s yield to maturity is 13.5%, and its modified duration is 7.8. The investor wants to know how the bond’s price will react if the yield rises to 14.5%.

Step 1: Calculate the price change using modified duration.
ΔPrice ≈ -Modified Duration × Price × ΔYield
ΔPrice ≈ -7.8 × 1,020 × 0.01
ΔPrice ≈ -KES 80 per unit
New price = 1,020 - 80 = KES 940 per unit
Total loss = 10,000 × 80 = KES 800,000

Step 2: Compare to the bond’s total coupon income over one year.
Annual coupon = 10,000 × 120 = KES 1,200,000
Loss-to-income ratio = 800,000 / 1,200,000 = 0.67

Step 3: Assess the breakeven yield change.
The bond’s price will return to KES 1,020 if yields fall back to 13.5%. To recover the KES 800,000 loss, yields must decline by 1% (7.8 × 1% × 1,020 ≈ 80). This requires a 100-basis-point rally from 14.5% to 13.5%.

Investment interpretation: The bond’s duration risk is severe. A 1% rise in yields erases two-thirds of the annual coupon income, and recovery requires a significant rally. An investor holding this bond should either shorten duration, hedge with a receiver swap, or accept the volatility as compensation for higher yield. Duration is not a prediction tool but a risk management framework—it tells the investor how much they stand to lose, not whether the loss is justified.

## Common Mistakes

- **Ignoring convexity in high-rate environments.** Kenyan investors often treat duration as a linear tool, assuming a 1% yield rise always produces an X% price drop. This ignores convexity, which becomes material when yields are already elevated. For example, a bond with a modified duration of 8 and convexity of 0.5 will understate losses in a rising-rate scenario. The mistake costs investors dearly when yields spike beyond 15%, as the linear approximation breaks down.

- **Mismatching duration with investment horizon.** Many Kenyan retail investors buy long-duration bonds for income without aligning the holding period to the bond’s maturity. A 15-year bond held for 3 years is still exposed to duration risk, yet investors often treat it as a short-term holding. The error compounds when liquidity constraints prevent early exit, forcing them to hold through rate hikes.

- **Overlooking embedded options in corporate bonds.** Bonds with call or put features exhibit non-linear duration behavior. For instance, Safaricom’s callable bonds may see duration drop sharply if yields fall, as the issuer is likely to refinance. Investors who ignore these options misprice the bond’s true sensitivity, leading to overpayment or under-hedging.

- **Assuming NSE liquidity offsets duration risk.** The Nairobi market’s thin trading volumes mean duration risk cannot be exited quickly. Investors who rely on the NSE’s secondary market for liquidity often face wide bid-ask spreads, exacerbating losses during rate shocks. This is particularly acute for corporate bonds, where turnover rarely exceeds KES 20 million daily.

## Checklist

- Verify the bond’s modified duration and convexity before purchase. Use the issuer’s latest financial statements to confirm cash flow timing, especially for amortizing bonds.
- Align the bond’s duration with your investment horizon. If holding for less than 5 years, avoid bonds with duration above 6.
- Stress-test the portfolio against a 200-basis-point rate hike. Calculate the worst-case loss using both duration and convexity to avoid linear approximation errors.
- Monitor the Central Bank of Kenya’s policy signals and inflation expectations. Duration risk is highest when the policy rate is near cyclical peaks, as seen in 2023.

_Informational only, not investment advice._
