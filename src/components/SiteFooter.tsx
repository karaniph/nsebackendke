import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="w-full max-w-prose mx-auto px-6 pt-16 pb-12">
      <div className="border-t border-border pt-8 flex items-baseline justify-between text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Form & Void</span>
        <div className="flex items-baseline gap-6">
          <Link to="/tags" className="hover:text-accent transition-colors">Tags</Link>
          <a href="/rss.xml" className="hover:text-accent transition-colors">RSS</a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
