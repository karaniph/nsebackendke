import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import SEOHead from "@/components/SEOHead";
import { getAllTags, getPostsByTag } from "@/lib/blog-data";

const TagsIndex = () => {
  const tags = getAllTags();

  return (
    <BlogLayout>
      <SEOHead title="Tags" description="Browse posts by topic." path="/tags" />
      <h1 className="text-3xl font-heading font-bold mb-12">Tags</h1>
      <div className="space-y-4">
        {tags.map((tag) => (
          <Link
            key={tag}
            to={`/tags/${tag}`}
            className="flex items-baseline justify-between group"
          >
            <span className="text-foreground group-hover:text-accent transition-colors">{tag}</span>
            <span className="text-sm text-muted-foreground">{getPostsByTag(tag).length}</span>
          </Link>
        ))}
      </div>
    </BlogLayout>
  );
};

export default TagsIndex;
