import type { ValuationMetric } from "@/lib/visual-blocks";

const toneClass: Record<string, string> = {
  positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  negative: "bg-red-500/10 text-red-700 dark:text-red-300",
  neutral: "bg-secondary text-muted-foreground"
};

const ValuationSnapshotCard = ({ metrics }: { metrics: ValuationMetric[] }) => {
  if (!metrics || metrics.length === 0) return null;
  return (
    <section className="content-card p-5 md:p-6">
      <h3 className="text-lg font-heading font-bold text-foreground">Valuation Snapshot</h3>
      <p className="text-xs text-muted-foreground mt-1">Auto-extracted from report content</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={`${metric.label}-${metric.value}`} className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="text-base font-semibold text-foreground mt-1">{metric.value}</p>
            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] ${toneClass[metric.signal || "neutral"]}`}>
              {metric.signal || "neutral"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValuationSnapshotCard;

