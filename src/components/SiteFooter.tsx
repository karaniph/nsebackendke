import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="brand-wordmark text-xl">
              NSE<span className="brand-accent">insider</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Independent market intelligence for the Nairobi Securities Exchange. Analysis you can act on.
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Content</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/category/market-briefs" className="hover:text-foreground transition-colors">Market Briefs</Link></li>
              <li><Link to="/category/deep-dives" className="hover:text-foreground transition-colors">Deep Dives</Link></li>
              <li><Link to="/category/education" className="hover:text-foreground transition-colors">Education</Link></li>
              <li><Link to="/category/bot-updates" className="hover:text-foreground transition-colors">Bot Updates</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/tags" className="hover:text-foreground transition-colors">Tags</Link></li>
              <li><Link to="/archive" className="hover:text-foreground transition-colors">Archive</Link></li>
              <li><Link to="/rss" className="hover:text-foreground transition-colors">RSS Feed</Link></li>
            </ul>
          </div>

          {/* Telegram CTA */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Get Alerts</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Join 5,000+ investors on our Telegram bot for real-time NSE updates.
            </p>
            <a
              href="https://t.me/NSEinsiderBot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Join @NSEinsiderBot
            </a>
          </div>
        </div>

        <div className="divider-fade my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NSEinsider. Not investment advice. Do your own research.</p>
          <p className="font-mono">Nairobi, Kenya 🇰🇪</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
