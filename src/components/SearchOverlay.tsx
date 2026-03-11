import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLivePosts } from "@/hooks/use-live-posts";
import { formatDate, CATEGORY_LABELS, sortPublishedPosts } from "@/lib/blog-data";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useLivePosts();
  const posts = sortPublishedPosts(data || []);

  const filtered = query.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          p.category.toLowerCase().includes(query.toLowerCase())
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
      <div className="container max-w-2xl pt-[15vh]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 border-b border-border">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, tags, topics..."
              className="flex-1 bg-transparent py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="hidden sm:inline-block text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">Esc</kbd>
          </div>
          <div className="max-h-[50vh] overflow-y-auto">
            {query.trim() && filtered.length === 0 && (
              <div className="empty-state py-12">
                <div className="empty-state-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">No posts found for "{query}"</p>
              </div>
            )}
            {filtered.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                onClick={onClose}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/60 transition-colors border-b border-border/40 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="category-badge text-[10px]" data-category={post.category}>
                      {CATEGORY_LABELS[post.category]}
                    </span>
                    <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-snug">{post.title}</h4>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mt-1 shrink-0">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            ))}
            {!query.trim() && (
              <div className="p-5 text-sm text-muted-foreground">
                Start typing to search across all posts and tags.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
