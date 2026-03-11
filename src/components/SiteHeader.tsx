import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInitialTheme, setTheme } from "@/lib/theme";

interface SiteHeaderProps {
  onSearchOpen: () => void;
}

const navLinks = [
  { label: "Market Briefs", path: "/category/market-briefs" },
  { label: "Deep Dives", path: "/category/deep-dives" },
  { label: "Education", path: "/category/education" },
  { label: "About", path: "/about" },
];

const SiteHeader = ({ onSearchOpen }: SiteHeaderProps) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(getInitialTheme);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => setCurrentTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-sm" : "bg-background border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Wordmark */}
        <Link to="/" className="brand-wordmark text-xl" aria-label="NSEinsider home">
          NSE<span className="brand-accent">insider</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                location.pathname.startsWith(link.path)
                  ? "text-foreground bg-secondary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={onSearchOpen}
            className="ml-2 p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-colors"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-colors"
            aria-label="Toggle theme"
          >
            {currentTheme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={onSearchOpen} className="p-2 text-muted-foreground" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-muted-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-in pb-4 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-3 text-sm rounded-lg ${
                location.pathname.startsWith(link.path)
                  ? "text-foreground bg-secondary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={toggleTheme} className="w-full text-left px-3 py-3 text-sm text-muted-foreground">
            {currentTheme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          </button>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
