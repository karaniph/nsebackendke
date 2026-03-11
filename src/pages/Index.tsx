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
      <section className="pt-16 pb-8 animate-in-up">
        <div className="accent-line mb-8" />
        <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight text-foreground">
          Building software<br />
          <span className="text-muted-foreground font-light">with intention.</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-6 max-w-md leading-relaxed">
          Essays on systems design, engineering culture, and the craft of writing code that endures.
        </p>
      </section>

      <div className="divider-fade my-10" />

      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8">
          Latest Posts
        </h2>
        <div className="space-y-2">
          {posts.map((post, i) => (
            <PostListItem key={post.slug} post={post} index={i} />
          ))}
        </div>
      </section>

      <NewsletterSignup />
    </BlogLayout>
  );
};

export default Index;
