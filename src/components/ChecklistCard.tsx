const ChecklistCard = ({ items }: { items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="content-card p-5 md:p-6">
      <h3 className="text-lg font-heading font-bold text-foreground">Checklist Card</h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded border border-border text-[10px] text-muted-foreground">✓</span>
            <span className="text-foreground/90">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ChecklistCard;

