import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import SEOHead from "@/components/SEOHead";
import { useLivePosts } from "@/hooks/use-live-posts";
import { getAllTagsFrom, getPostsByTagFrom } from "@/lib/blog-data";

const TagsIndex = () => {
  const { data } = useLivePosts();
  const posts = data || [];
  const tags = getAllTagsFrom(posts);

  return (
    <BlogLayout>
      <SEOHead title="Tags" description="Browse NSEinsider posts by topic." path="/tags" />
      <div className="container py-12 md:py-16 max-w-3xl animate-in-up">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Tags</h1>
        <p className="text-muted-foreground mb-10">Browse all topics across our analysis and education content.</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="tag-chip text-sm px-3 py-1.5"
            >
              {tag}
              <span className="ml-1.5 text-muted-foreground/60">{getPostsByTagFrom(posts, tag).length}</span>
            </Link>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default TagsIndex;
