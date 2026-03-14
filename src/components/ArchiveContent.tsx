// src/components/ArchiveContent.tsx
import PostCard from "@/components/PostCard";
import type { BlogPost, ArchiveMonth } from "@/lib/blog-data";

interface ArchiveContentProps {
  posts: BlogPost[];
  archiveMonths: ArchiveMonth[];
  yearNum: number;
  monthNum: number;
  pageTitle: string;
}

const ArchiveContent = ({ posts, archiveMonths, yearNum, monthNum, pageTitle }: ArchiveContentProps) => {

  return (
    <div className="container py-12 md:py-16 animate-in-up flex-1">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <a href="/" className="hover:text-foreground transition-colors">Home</a>
        <span>/</span>
        <span className="text-foreground font-medium">{pageTitle}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-12">
        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-4">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Archive
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground mt-2">
              {posts.length} post{posts.length !== 1 ? "s" : ""} published
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state py-16">
              <div className="empty-state-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">No posts in this period</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try browsing another month in the archive.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {posts.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} asAstroLink />
              ))}
            </div>
          )}
        </div>

        {/* Archive sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Browse by Month</h2>
            <ul className="space-y-1">
              {archiveMonths.map((m) => {
                const isActive =
                  m.year === yearNum && m.month === monthNum;
                return (
                  <li key={m.href}>
                    <a
                      href={m.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-accent/10 text-accent font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className="text-xs tabular-nums opacity-60">{m.count}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArchiveContent;
