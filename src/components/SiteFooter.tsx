import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="site-footer w-full max-w-prose mx-auto px-6 pb-12 pt-20">
      <div className="divider-fade mb-8" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Form & Void</span>
        <div className="flex items-center gap-5">
          <Link to="/tags" className="btn-subtle">Tags</Link>
          <a href="/rss.xml" className="btn-subtle">RSS</a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
