interface RSSContentProps {
  rssContent: string;
}

const RSSContent = ({ rssContent }: RSSContentProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(rssContent);
  };

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">RSS Feed</h1>
      <p className="text-muted-foreground mb-6">
        Subscribe to NSEinsider in your favourite RSS reader. Copy the feed URL or the raw XML below.
      </p>

      <div className="content-card p-5 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Feed URL</p>
            <p className="text-sm text-muted-foreground font-mono mt-1">https://nseinsider.co.ke/rss.xml</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText("https://nseinsider.co.ke/rss.xml")}
            className="btn-outline text-xs px-3 py-1.5 shrink-0"
          >
            Copy URL
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 btn-outline text-xs px-3 py-1.5 z-10"
        >
          Copy XML
        </button>
        <pre className="bg-card border border-border rounded-xl p-5 overflow-x-auto text-xs leading-relaxed font-mono text-muted-foreground max-h-96 overflow-y-auto">
          {rssContent}
        </pre>
      </div>
    </div>
  );
};

export default RSSContent;
