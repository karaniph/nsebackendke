import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getPublishedPosts, formatDate, type BlogPost } from "@/lib/blog-data";

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
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 search-overlay animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-prose mx-auto px-6 pt-32"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full bg-transparent border-b-2 border-foreground pb-3 text-2xl font-heading font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
        />
        <div className="mt-8 space-y-6">
          {query.trim() && filtered.length === 0 && (
            <p className="text-muted-foreground text-sm">No posts found.</p>
          )}
          {filtered.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              onClick={onClose}
              className="block group"
            >
              <span className="text-sm text-muted-foreground">{formatDate(post.date)}</span>
              <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-accent transition-colors mt-1">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          Press <kbd className="bg-secondary px-1.5 py-0.5 rounded-sm">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};

export default SearchOverlay;
