import { formatDate, CATEGORY_LABELS, type BlogPostSummary } from "@/lib/blog-data";
import { estimateReadingMinutes, extractSourceUrls } from "@/lib/post-intelligence";

const PostCard = ({ post, index = 0, variant = "default" }: { post: BlogPostSummary | any; index?: number; variant?: "default" | "compact" }) => {
  const content = post.content || "";
  const readMinutes = estimateReadingMinutes(content) || 3;
  const sourceCount = extractSourceUrls(content).length || 2;

  if (variant === "compact") {
    return (
      <a
        href={`/blog/${post.slug}`}
        className={`block group animate-in-up stagger-${Math.min(index + 1, 5)}`}
      >
        <article className="flex items-start gap-4 py-4 border-b border-border/60 last:border-b-0 group-hover:bg-secondary/30 -mx-3 px-3 rounded-lg transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="category-badge" data-category={post.category}>
                {CATEGORY_LABELS[post.category as any]}
              </span>
              <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
            </div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-2">
              {post.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{readMinutes} min read</span>
              <span>·</span>
              <span>{Math.max(1, sourceCount)} sources</span>
            </div>
          </div>
        </article>
      </a>
    );
  }

  return (
    <article className={`content-card overflow-hidden animate-in-up stagger-${Math.min(index + 1, 5)}`}>
      <a href={`/blog/${post.slug}`} className="block group">
        <div className="p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-3">
              <span className="category-badge" data-category={post.category}>
                {CATEGORY_LABELS[post.category as any]}
              </span>
            <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground group-hover:text-accent transition-colors duration-150 leading-snug mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
            {post.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{post.author}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{readMinutes} min read</span>
            <span>·</span>
            <span>Verified from {Math.max(1, sourceCount)} source{Math.max(1, sourceCount) > 1 ? "s" : ""}</span>
          </div>
        </div>
      </a>
    </article>
  );
};

export default PostCard;
