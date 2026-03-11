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
      <h1 className="text-3xl font-heading font-bold mb-12">{tag}</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground text-sm">No posts with this tag.</p>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      )}
    </BlogLayout>
  );
};

export default TagPage;
