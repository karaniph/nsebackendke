import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { getPublishedPosts, formatDate } from "@/lib/blog-data";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const posts = getPublishedPosts();

  const filtered = query.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) onClose();
  }, [isOpen, onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 search-overlay animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-prose mx-auto px-6 pt-[20vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-transparent border-b-2 border-foreground/20 pb-4 text-3xl font-heading font-light text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-all duration-300"
          />
          {query && (
            <span className="absolute right-0 bottom-5 text-xs text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="mt-10 space-y-1">
          {query.trim() && filtered.length === 0 && (
            <p className="text-muted-foreground text-sm py-4">No posts found.</p>
          )}
          {filtered.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              onClick={onClose}
              className={`block group post-card animate-in-up stagger-${Math.min(i + 1, 5)}`}
            >
              <span className="text-xs text-muted-foreground font-mono">{formatDate(post.date)}</span>
              <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-accent transition-colors mt-1">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
        <p className="mt-16 text-xs text-muted-foreground/60">
          Press <kbd className="bg-secondary px-2 py-0.5 rounded text-foreground/60 ml-1">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};

export default SearchOverlay;
