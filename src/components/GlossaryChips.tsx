import type { GlossaryItem } from "@/lib/visual-blocks";

const GlossaryChips = ({ items }: { items: GlossaryItem[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="content-card p-5 md:p-6">
      <h3 className="text-lg font-heading font-bold text-foreground">Glossary</h3>
      <p className="text-xs text-muted-foreground mt-1">Tap terms to understand faster while reading.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.term}
            className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs text-foreground"
            title={item.definition}
          >
            {item.term}
          </span>
        ))}
      </div>
      <div className="mt-3 space-y-2 text-xs text-muted-foreground">
        {items.slice(0, 3).map((item) => (
          <p key={`${item.term}-def`}>
            <span className="font-semibold text-foreground">{item.term}:</span> {item.definition}
          </p>
        ))}
      </div>
    </section>
  );
};

export default GlossaryChips;

