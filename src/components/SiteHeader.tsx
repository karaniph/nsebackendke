import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInitialTheme, setTheme } from "@/lib/theme";

interface SiteHeaderProps {
  onSearchOpen: () => void;
}

const SiteHeader = ({ onSearchOpen }: SiteHeaderProps) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    const next = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(next);
  };

  return (
    <header className="w-full max-w-prose mx-auto px-6 pt-16 pb-12">
      <nav className="flex items-baseline justify-between">
        <Link to="/" className="font-heading text-xl font-semibold tracking-tight text-foreground hover:text-accent transition-colors">
          Form & Void
        </Link>
        <div className="flex items-baseline gap-6 text-sm">
          <button
            onClick={onSearchOpen}
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            Search
          </button>
          <Link
            to="/contact"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            Contact
          </Link>
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-accent transition-colors"
            aria-label="Toggle theme"
          >
            {currentTheme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;
