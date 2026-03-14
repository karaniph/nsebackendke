// src/components/TickerBar.tsx

const TickerBar = () => {
  const indices = [
    { label: "NASI", value: "1.8%", direction: "up" },
    { label: "SCOM", value: "1.5%", price: "28.40", direction: "up" },
    { label: "KCB", value: "4.2%", price: "42.50", direction: "up" },
    { label: "EQTY", value: "3.1%", price: "51.75", direction: "up" },
    { label: "BAT", value: "2.1%", price: "345.00", direction: "down" },
    { label: "BAMB", value: "1.6%", price: "32.50", direction: "down" },
    { label: "EABL", value: "0.8%", price: "165.00", direction: "down" },
    { label: "COOP", value: "2.8%", price: "14.90", direction: "up" },
  ];

  return (
    <div className="ticker-bar overflow-hidden py-2 text-xs font-mono relative z-50">
      <div className="ticker-scroll flex items-center gap-8 whitespace-nowrap">
        {/* Render twice for seamless infinite scroll */}
        {[...indices, ...indices].map((item, i) => (
          <span key={i}>
            {item.label}{" "}
            <span className={`stat-pill ${item.direction}`}>
              {item.direction === "up" ? "▲" : "▼"} {item.value}
            </span>{" "}
            {item.price}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
