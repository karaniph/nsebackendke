// src/lib/affiliate.ts
// Single source of truth for the TradingView affiliate integration.
//
// TradingView lists the Nairobi Securities Exchange under the `NSEKE` prefix
// (e.g. NSEKE:SCOM = Safaricom, page tradingview.com/symbols/NSEKE-SCOM/), so
// symbol deep-links and chart widgets resolve correctly for NSE counters.
// NOTE: the exchange prefix is NSEKE, not NSE (which is India's exchange).

export const TRADINGVIEW_AFF_ID = "170183";

/** Stock Analysis Pro affiliate link supplied by NSEinsider. */
export const STOCK_ANALYSIS_AFF_URL = "https://stockanalysis.com/pro/?ref=nseinsider";

/** Generic affiliate landing link (homepage). */
export const TRADINGVIEW_AFF_URL = `https://www.tradingview.com/?aff_id=${TRADINGVIEW_AFF_ID}`;

/** TradingView exchange code for the Nairobi Securities Exchange. */
export const TV_EXCHANGE = "NSEKE";

/** Short incentive line used across CTAs. */
export const TRADINGVIEW_INCENTIVE = "Free charts, indicators, and alerts";

/** rel value for outbound affiliate links (FTC + SEO best practice). */
export const AFFILIATE_REL = "sponsored noopener noreferrer";

/** Keep affiliate click reporting consistent without making links dependent on analytics. */
export function trackAffiliateClick(partner: "stock_analysis" | "tradingview", placement: string): void {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "affiliate_click", { affiliate_partner: partner, affiliate_placement: placement });
}

/** Widget symbol, e.g. "NSEKE:SCOM". */
export function tradingViewSymbol(ticker: string): string {
  return `${TV_EXCHANGE}:${ticker.toUpperCase()}`;
}

/**
 * Affiliate-tagged deep link to a counter's chart/overview page,
 * e.g. https://www.tradingview.com/symbols/NSEKE-SCOM/?aff_id=170183
 */
export function tradingViewSymbolUrl(ticker: string): string {
  return `https://www.tradingview.com/symbols/${TV_EXCHANGE}-${ticker.toUpperCase()}/?aff_id=${TRADINGVIEW_AFF_ID}`;
}

/** Affiliate URL for a ticker if provided, otherwise the generic landing link. */
export function tradingViewLink(ticker?: string | null): string {
  return ticker ? tradingViewSymbolUrl(ticker) : TRADINGVIEW_AFF_URL;
}
