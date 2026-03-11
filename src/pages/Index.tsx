import BlogLayout from "@/components/BlogLayout";
import PostListItem from "@/components/PostListItem";
import NewsletterSignup from "@/components/NewsletterSignup";
import SEOHead from "@/components/SEOHead";
import { getPublishedPosts } from "@/lib/blog-data";

const Index = () => {
  const posts = getPublishedPosts();

  return (
    <BlogLayout>
      <SEOHead
        title="Form & Void"
        description="Essays on systems design, engineering culture, and the craft of building software."
      />
      <section className="mb-20">
        <h1 className="text-3xl font-heading font-bold mb-4">Latest</h1>
        <p className="text-muted-foreground text-sm mb-16">
          Essays on systems, craft, and engineering culture.
        </p>
        <div className="space-y-12">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <NewsletterSignup />
    </BlogLayout>
  );
};

export default Index;
