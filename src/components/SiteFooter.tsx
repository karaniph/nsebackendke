const SiteFooter = () => {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="brand-wordmark text-xl">
              NSE<span className="brand-accent">insider</span>
            </a>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Independent market intelligence for the Nairobi Securities Exchange. Analysis you can act on.
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Content</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="/category/news" className="hover:text-foreground transition-colors">News</a></li>
              <li><a href="/category/market-briefs" className="hover:text-foreground transition-colors">Market Briefs</a></li>
              <li><a href="/category/deep-dives" className="hover:text-foreground transition-colors">Deep Dives</a></li>
              <li><a href="/category/education" className="hover:text-foreground transition-colors">Education</a></li>
              <li><a href="/category/bot-updates" className="hover:text-foreground transition-colors">Bot Updates</a></li>
              <li><a href="/stocks" className="hover:text-foreground transition-colors">Stocks</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms & Conditions</a></li>
              <li><a href="/tags" className="hover:text-foreground transition-colors">Tags</a></li>
              <li><a href="/archive" className="hover:text-foreground transition-colors">Archive</a></li>
              <li><a href="/rss" className="hover:text-foreground transition-colors">RSS Feed</a></li>
            </ul>
          </div>

          {/* Telegram CTA */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Telegram Channel</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Join our Telegram channel for NSE updates and market commentary.
            </p>
            <a
              href="https://t.me/nseinsiderske"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Join @nseinsiderske
            </a>
          </div>
        </div>

        <div className="divider-fade my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NSEinsider. Not investment advice. Do your own research.</p>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <a
              href="https://urimtrader.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Visit Urim Trader
            </a>
            <p className="font-mono">Nairobi, Kenya 🇰🇪</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
