import type { RiskItem } from "@/lib/visual-blocks";

function riskColor(level: "low" | "medium" | "high"): string {
  if (level === "high") return "bg-red-500/20 text-red-700 dark:text-red-300";
  if (level === "medium") return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
  return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300";
}

const RiskMatrix = ({ items }: { items: RiskItem[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="content-card p-5 md:p-6">
      <h3 className="text-lg font-heading font-bold text-foreground">Risk Matrix</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article key={item.risk} className="rounded-lg border border-border bg-background p-3">
            <p className="text-sm text-foreground">{item.risk}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span className={`rounded-full px-2 py-0.5 ${riskColor(item.impact)}`}>Impact: {item.impact}</span>
              <span className={`rounded-full px-2 py-0.5 ${riskColor(item.likelihood)}`}>Likelihood: {item.likelihood}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RiskMatrix;

