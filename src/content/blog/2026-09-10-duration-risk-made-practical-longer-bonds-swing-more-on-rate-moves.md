---
title: "Duration risk made practical: longer bonds swing more on rate moves"
description: "A practical, evergreen guide: longer-duration bonds magnify price moves when rates shift, with a simple pre-trade check for Kenyan investors."
date: "2026-09-10T07:00:00+03:00"
author: "NSEinsider"
category: "education"
tags: ["education", "nse", "investing-kenya", "bonds", "cbk"]
slug: "2026-09-10-duration-risk-made-practical-longer-bonds-swing-more-on-rate-moves"
draft: false
---

## Why this matters
Longer-duration bonds swing more when rates move. For Kenyan retail investors on the NSE, that means bigger bumps in price if policy or market rates shift, and a higher bar for sticking to a planned income or wealth-preservation goal. The right balance of maturity and duration helps you tolerate rate shocks without overhauling your whole portfolio.

## The concept
- Duration measures how sensitive a bond’s price is to interest-rate changes. In simple terms, higher duration means bigger price moves for a given rate change.
- Macaulay duration is a weighted-average time to receive cash flows, expressed in years. Modified duration translates that into an approximate percentage price change for a small yield move.
- If yield rises by a small amount, a bond with a longer duration loses more value (as a percentage) than a bond with a shorter duration. The opposite happens when yields fall.
- Convexity is the second-order effect: longer-duration bonds typically have higher convexity, which can cushion losses a little or push gains a bit more than the linear rule suggests for larger moves.

A quick, practical rule: price change ≈ -modified_duration × yield_change (yield_change in decimal form). This is a useful teaching shortcut, but remember it’s an approximation that grows less accurate for large moves when convexity matters.

## How it works on the NSE
- Kenyan fixed-income trading on the NSE features Treasury Bonds and other notes that respond to policy-rate expectations set by the Central Bank. The current rate environment, for context, includes a central-bank rate around the mid-to-high single digits, and near-term yields like the 91-day Treasuries sit just under 9% in the official window. These levels influence all maturities, but the impact is not uniform across durations.
- Longer-dated issues on the NSE will typically exhibit larger percentage price moves for the same direction of rate change than short-dated issues. That’s the essence of duration risk in practice: the longer the time to cash flow, the bigger the sensitivity to a change in yields.
- The market’s liquidity and the structure of the yield curve matter too. In periods of uneven liquidity, large rate moves can amplify price gaps for long-duration instruments, even if the coupon is modest.

Context from today’s market snapshot (for flavour): the NSE sentiment and fixed-income window show activity in turnover and pricing signals around the Central Bank framework (CBR) and near-term yields, with the policy stance influencing expectations for longer maturities.

## Worked example
- Setup (illustrative, not a real trade): compare two plain-vanilla bonds, both priced near par but with different durations.
- Bond A (short duration): **D = 3 years**. Assume near-par price, coupon is typical for its risk; you hold it for a planned horizon. Bond B (long duration): **D = 8 years**. Same coupon level, but longer time to cash flows.
- Scenario: yields move up by +50 basis points (0.50%). Using the simple linear rule (ΔP/P ≈ -D × Δy):
  - For **Bond A**, ΔP/P ≈ -3 × 0.005 = -0.015, or about a 1.5% price drop.
  - For **Bond B**, ΔP/P ≈ -8 × 0.005 = -0.040, or about a 4.0% price drop.
- Resulting prices (illustrative): starting from 100, Bond A might move to about 98.50; Bond B to about 96.00.
- Important caveat: the linear rule ignores convexity. If you assume positive convexity (common for longer bonds), the actual move could be a touch less painful than the straight-line calc, especially if the rate move isn’t huge. Still, the directional signal holds: all else equal, the longer-duration bond experiences a larger price swing.
- Takeaway: duration magnifies sensitivity to rate moves, and the degree of that magnification scales with duration. In practice, long-duration holdings demand stronger risk checks and scenario planning.

## Common mistakes
- Assuming all bonds with the same coupon behave identically. Duration matters more than coupon alone.
- Ignoring convexity. Linear approximations break down with larger moves; longer-duration bonds usually have more convexity, which can cushion some losses but won’t erase them in a rising-rate environment.
- Using spot yields alone without considering yield-to-maturity and its impact on price. A bond’s current yield and coupon structure matter for total return.
- Not stress-testing across rate scenarios (both rises and falls) or across different maturities. One-shot thinking invites surprises when the curve shifts.
- Forgetting reinvestment risk and credit risk. Duration focuses on price sensitivity; total return depends on coupon reinvestment and the issuer’s credit profile.

## Your checklist
- Look up the bond’s modified duration before buying; compare across maturities to gauge relative price sensitivity.
- Run two or three rate-change scenarios (e.g., +25, +50, -25 bps) to see potential price paths.
- Align duration with your time horizon and liquidity needs; avoid concentrating too much in ultra-long duration if you expect elevated volatility.
- Consider laddering across maturities to smooth duration risk and improve reinvestment opportunities.
- Check liquidity and trading windows on the NSE for the specific instrument; long-duration issues can be harder to exit in stressed markets.

## FAQ
- What is duration vs. maturity? Duration is a price-sensitivity measure to yield changes, while maturity is the calendar date when the principal is repaid. A bond can have a long maturity but a shorter effective duration if it pays large coupons earlier.
- Do long-duration bonds always perform worse when rates rise? Not always. They tend to fall more in price with rate rises, but higher convexity can cushion losses for moderate moves. For large moves, the gap widens because the linear approximation breaks down.
- How can I manage duration risk on the NSE? Build a diversified mix of maturities (ladder), monitor each instrument’s duration, stress-test key rate scenarios, and keep some liquidity to rebalance as rate expectations shift.

Informational only, not investment advice.
