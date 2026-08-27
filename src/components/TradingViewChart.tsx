// src/components/TradingViewChart.tsx
// Embedded TradingView Advanced Chart for an NSE counter, with an affiliate
// credit link beneath it. Client-only island (loads TradingView's embed script).
import { useEffect, useRef } from "react";
import {
  tradingViewSymbol,
  tradingViewSymbolUrl,
  TRADINGVIEW_INCENTIVE,
  AFFILIATE_REL,
} from "@/lib/affiliate";

interface TradingViewChartProps {
  /** NSE ticker, e.g. "SCOM". */
  ticker: string;
  /** Company name for the caption. */
  name?: string;
  height?: number;
  theme?: "light" | "dark";
}

const TradingViewChart = ({ ticker, name, height = 460, theme = "light" }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const symbol = tradingViewSymbol(ticker);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset (handles re-render / StrictMode double-invoke).
    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Africa/Nairobi",
      theme,
      style: "1",
      locale: "en",
      hide_side_toolbar: true,
      allow_symbol_change: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [symbol, theme]);

  return (
    <figure className="content-card overflow-hidden p-0">
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height: `${height}px`, width: "100%" }}
      >
        <div className="tradingview-widget-container__widget" />
      </div>
      <figcaption className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-t border-border/60 text-xs text-muted-foreground">
        <span>
          {name ? `${name} (${ticker})` : ticker} chart. Data via TradingView; may be delayed.
        </span>
        <a
          href={tradingViewSymbolUrl(ticker)}
          target="_blank"
          rel={AFFILIATE_REL}
          className="font-medium text-accent hover:text-accent/80 whitespace-nowrap"
        >
          Open full interactive chart — {TRADINGVIEW_INCENTIVE} →
        </a>
      </figcaption>
    </figure>
  );
};

export default TradingViewChart;
