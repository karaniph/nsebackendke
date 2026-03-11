import { useParams } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import PostListItem from "@/components/PostListItem";
import SEOHead from "@/components/SEOHead";
import { getPostsByTag } from "@/lib/blog-data";

const TagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const posts = tag ? getPostsByTag(tag) : [];

  return (
    <BlogLayout>
      <SEOHead title={`#${tag}`} description={`Posts tagged "${tag}".`} path={`/tags/${tag}`} />
      <div className="pt-12 animate-in-up">
        <div className="accent-line mb-8" />
        <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">{tag}</h1>
        <p className="text-sm text-muted-foreground mb-12">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts with this tag.</p>
        ) : (
          <div className="space-y-2">
            {posts.map((post, i) => (
              <PostListItem key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default TagPage;
