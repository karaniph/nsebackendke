import { BarChart3, LineChart } from "lucide-react";
import {
  AFFILIATE_REL,
  STOCK_ANALYSIS_AFF_URL,
  TRADINGVIEW_INCENTIVE,
  tradingViewLink,
  trackAffiliateClick,
} from "@/lib/affiliate";

interface ResearchToolsCTAProps {
  ticker?: string | null;
  placement?: string;
}

/** Intent-matched affiliate module: fundamentals first, technicals second. */
const ResearchToolsCTA = ({ ticker = null, placement = "content" }: ResearchToolsCTAProps) => {
  const tradingViewHref = tradingViewLink(ticker);

  return (
    <section className="content-card p-5 md:p-6 border-l-4 border-l-accent" aria-labelledby="research-tools-title">
      <div className="flex flex-col gap-1 mb-5">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Build your research stack</p>
        <h2 id="research-tools-title" className="text-xl font-heading font-bold text-foreground">
          Research the story, then chart the move
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Use the right tool for the question: financials and valuation first, price action and alerts second.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a
          href={STOCK_ANALYSIS_AFF_URL}
          target="_blank"
          rel={AFFILIATE_REL}
          data-affiliate="stock-analysis"
          onClick={() => trackAffiliateClick("stock_analysis", placement)}
          className="group rounded-xl border border-border/70 bg-secondary/35 p-4 transition-colors hover:border-accent/60 hover:bg-secondary/70"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-lg bg-accent/10 p-2 text-accent"><BarChart3 className="h-5 w-5" /></span>
            <span className="text-xs text-muted-foreground group-hover:text-accent">Explore Pro →</span>
          </div>
          <h3 className="mt-4 font-semibold text-foreground">Stock Analysis Pro</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Compare financials, valuation, dividends, analyst estimates, and screeners across global stocks.
          </p>
        </a>

        <a
          href={tradingViewHref}
          target="_blank"
          rel={AFFILIATE_REL}
          data-affiliate="tradingview"
          onClick={() => trackAffiliateClick("tradingview", placement)}
          className="group rounded-xl border border-border/70 bg-secondary/35 p-4 transition-colors hover:border-accent/60 hover:bg-secondary/70"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-lg bg-accent/10 p-2 text-accent"><LineChart className="h-5 w-5" /></span>
            <span className="text-xs text-muted-foreground group-hover:text-accent">Open charts →</span>
          </div>
          <h3 className="mt-4 font-semibold text-foreground">TradingView</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {ticker ? `Chart ${ticker} with interactive candles, indicators, and alerts.` : "Chart NSE counters with interactive candles, indicators, and alerts."} {TRADINGVIEW_INCENTIVE}.
          </p>
        </a>
      </div>

    </section>
  );
};

export default ResearchToolsCTA;
