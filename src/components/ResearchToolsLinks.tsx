import { BarChart3, LineChart } from "lucide-react";
import { AFFILIATE_REL, STOCK_ANALYSIS_AFF_URL, tradingViewLink, trackAffiliateClick } from "@/lib/affiliate";

interface ResearchToolsLinksProps {
  ticker?: string | null;
  placement?: string;
}

const ResearchToolsLinks = ({ ticker = null, placement = "article_top" }: ResearchToolsLinksProps) => (
  <section className="content-card mt-6 p-4 md:p-5" aria-labelledby="research-links-title">
    <div className="flex flex-col gap-1 mb-3">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Useful next step</p>
      <h2 id="research-links-title" className="text-base font-heading font-bold text-foreground">Research this idea</h2>
    </div>
    <div className="flex flex-col sm:flex-row gap-2">
      <a href={STOCK_ANALYSIS_AFF_URL} target="_blank" rel={AFFILIATE_REL} onClick={() => trackAffiliateClick("stock_analysis", placement)} className="btn-outline inline-flex items-center justify-center gap-2 text-sm flex-1">
        <BarChart3 className="h-4 w-4 text-accent" />
        Check financials on Stock Analysis →
      </a>
      <a href={tradingViewLink(ticker)} target="_blank" rel={AFFILIATE_REL} onClick={() => trackAffiliateClick("tradingview", placement)} className="btn-brand inline-flex items-center justify-center gap-2 text-sm flex-1">
        <LineChart className="h-4 w-4" />
        {ticker ? `Chart ${ticker} on TradingView →` : "Open charts on TradingView →"}
      </a>
    </div>
  </section>
);

export default ResearchToolsLinks;
