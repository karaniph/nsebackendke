// src/components/TradingViewCTA.tsx
// Reusable TradingView affiliate CTA. Mirrors TelegramCTA's default/inline
// variants and styling so it feels native to the site.
import { LineChart } from "lucide-react";
import { tradingViewLink, TRADINGVIEW_INCENTIVE, AFFILIATE_REL, trackAffiliateClick } from "@/lib/affiliate";

interface TradingViewCTAProps {
  variant?: "default" | "inline";
  /** NSE ticker (e.g. "SCOM"). When set, the CTA deep-links to that counter's chart. */
  ticker?: string | null;
}

const TradingViewCTA = ({ variant = "default", ticker = null }: TradingViewCTAProps) => {
  const href = tradingViewLink(ticker);
  const label = ticker ? `Chart ${ticker} on TradingView` : "Open TradingView charts";

  if (variant === "inline") {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl bg-secondary/60 border border-border/60">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {ticker ? `Analyze ${ticker} technicals on TradingView` : "Chart the NSE on TradingView"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactive charts, indicators, and alerts. {TRADINGVIEW_INCENTIVE}.
          </p>
        </div>
        <a href={href} target="_blank" rel={AFFILIATE_REL} onClick={() => trackAffiliateClick("tradingview", "tradingview_cta_inline")} className="btn-brand text-sm whitespace-nowrap">
          {label} →
        </a>
      </div>
    );
  }

  return (
    <section className="content-card p-6 md:p-7 border-l-4 border-l-accent">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
            <LineChart className="h-5 w-5 text-accent" />
            {ticker ? `Chart ${ticker} like a pro` : "Chart the NSE like a pro"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
            Open {ticker ? `${ticker}` : "NSE counters"} on TradingView for interactive candlesticks,
            moving averages, RSI/MACD, and price alerts. {TRADINGVIEW_INCENTIVE}.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={href} target="_blank" rel={AFFILIATE_REL} onClick={() => trackAffiliateClick("tradingview", "tradingview_cta_default")} className="btn-brand whitespace-nowrap">
            <LineChart className="h-4 w-4" />
            {label}
          </a>
        </div>
      </div>
    </section>
  );
};

export default TradingViewCTA;
