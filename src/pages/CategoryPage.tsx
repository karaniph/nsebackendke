import { useParams } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import { getPostsByCategory, CATEGORY_LABELS, type PostCategory } from "@/lib/blog-data";

const CATEGORY_DESCRIPTIONS: Record<PostCategory, string> = {
  "market-briefs": "Weekly NSE performance summaries, top movers, and what to watch next.",
  "deep-dives": "Comprehensive analysis of NSE-listed companies — valuation, strategy, and risks.",
  "education": "Practical guides to investing on the Nairobi Securities Exchange.",
  "bot-updates": "Product updates, new features, and tips for the NSEinsider Telegram Bot.",
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const cat = category as PostCategory;
  const posts = cat ? getPostsByCategory(cat) : [];
  const label = cat ? CATEGORY_LABELS[cat] : "";
  const desc = cat ? CATEGORY_DESCRIPTIONS[cat] : "";

  if (!label) {
    return (
      <BlogLayout>
        <div className="container py-20 empty-state">
          <div className="empty-state-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
          </div>
          <p className="text-foreground font-semibold">Category not found</p>
          <p className="text-sm text-muted-foreground mt-1">This category doesn't exist.</p>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <SEOHead title={label} description={desc} path={`/category/${cat}`} />
      <div className="container py-12 md:py-16 animate-in-up">
        <div className="mb-10">
          <span className="category-badge mb-3" data-category={cat}>{label}</span>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3">{label}</h1>
          <p className="text-muted-foreground mt-2 max-w-lg">{desc}</p>
        </div>
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>
            </div>
            <p className="text-sm font-medium text-foreground">No posts yet</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon — new content is published weekly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default CategoryPage;
