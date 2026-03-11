import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInitialTheme, setTheme } from "@/lib/theme";

interface SiteHeaderProps {
  onSearchOpen: () => void;
}

const SiteHeader = ({ onSearchOpen }: SiteHeaderProps) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(getInitialTheme);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setCurrentTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="w-full max-w-prose mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
        >
          Form & Void
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <button onClick={onSearchOpen} className="btn-subtle">
            Search
          </button>
          <Link to="/contact" className="btn-subtle">
            Contact
          </Link>
          <button
            onClick={toggleTheme}
            className="btn-subtle flex items-center gap-1.5"
            aria-label="Toggle theme"
          >
            <span className="inline-block w-3 h-3 rounded-full border border-current transition-colors" 
                  style={{ background: currentTheme === "dark" ? "currentColor" : "transparent" }} />
            {currentTheme === "light" ? "Dark" : "Light"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
