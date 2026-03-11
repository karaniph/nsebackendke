import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import SEOHead from "@/components/SEOHead";
import { getAllTags, getPostsByTag } from "@/lib/blog-data";

const TagsIndex = () => {
  const tags = getAllTags();

  return (
    <BlogLayout>
      <SEOHead title="Tags" description="Browse posts by topic." path="/tags" />
      <div className="pt-12 animate-in-up">
        <div className="accent-line mb-8" />
        <h1 className="text-3xl font-heading font-bold mb-12 text-foreground">Tags</h1>
        <div className="space-y-1">
          {tags.map((tag, i) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className={`post-card flex items-baseline justify-between group animate-in-up stagger-${Math.min(i + 1, 5)}`}
            >
              <span className="text-foreground group-hover:text-accent transition-colors font-mono text-sm">{tag}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {getPostsByTag(tag).length} post{getPostsByTag(tag).length !== 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default TagsIndex;
