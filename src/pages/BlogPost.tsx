import { useParams, Link, Navigate } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import PostCard from "@/components/PostCard";
import TelegramCTA from "@/components/TelegramCTA";
import SEOHead from "@/components/SEOHead";
import { useLivePosts } from "@/hooks/use-live-posts";
import { getPostBySlugFrom, getRelatedPostsFrom, getAdjacentPostsFrom, formatDate, CATEGORY_LABELS } from "@/lib/blog-data";

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let key = 0;

  const processInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
      const m = match[0];
      if (m.startsWith("`")) {
        parts.push(<code key={`i${key++}`}>{m.slice(1, -1)}</code>);
      } else if (m.startsWith("**")) {
        parts.push(<strong key={`i${key++}`}>{m.slice(2, -2)}</strong>);
      } else if (m.startsWith("*")) {
        parts.push(<em key={`i${key++}`}>{m.slice(1, -1)}</em>);
      } else if (m.startsWith("[")) {
        const linkMatch = m.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) parts.push(<a key={`i${key++}`} href={linkMatch[2]}>{linkMatch[1]}</a>);
      }
      lastIndex = match.index + m.length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts.length > 0 ? parts : [text];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(<pre key={key++}><code>{codeLines.join("\n")}</code></pre>);
        codeLines = [];
        inCodeBlock = false;
      } else { inCodeBlock = true; }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }
    if (line.trim() === "") continue;
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={key++}>{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(<blockquote key={key++}>{processInline(line.slice(2))}</blockquote>);
    } else if (line.startsWith("- ")) {
      const items: string[] = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith("- ")) { i++; items.push(lines[i].slice(2)); }
      elements.push(<ul key={key++}>{items.map((item, j) => <li key={j}>{processInline(item)}</li>)}</ul>);
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [line.replace(/^\d+\. /, "")];
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i + 1])) { i++; items.push(lines[i].replace(/^\d+\. /, "")); }
      elements.push(<ol key={key++}>{items.map((item, j) => <li key={j}>{processInline(item)}</li>)}</ol>);
    } else {
      elements.push(<p key={key++}>{processInline(line)}</p>);
    }
  }
  return elements;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useLivePosts();
  const posts = data || [];
  const post = slug ? getPostBySlugFrom(posts, slug) : undefined;

  if (isLoading) {
    return (
      <BlogLayout>
        <article className="container max-w-3xl py-16">
          <p className="text-sm text-muted-foreground">Loading post...</p>
        </article>
      </BlogLayout>
    );
  }
  if (!post) return <Navigate to="/404" replace />;

  const related = getRelatedPostsFrom(posts, post);
  const { prev, next } = getAdjacentPostsFrom(posts, post.slug);

  return (
    <BlogLayout>
      <SEOHead
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        publishedDate={post.date}
        modifiedDate={post.date}
        author={post.author}
        section={CATEGORY_LABELS[post.category]}
        keywords={post.tags}
        schemaType="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: CATEGORY_LABELS[post.category], path: `/category/${post.category}` },
          { name: post.title, path: `/blog/${post.slug}` }
        ]}
      />
      <article className="container max-w-3xl py-12 md:py-16 animate-in-up">
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <Link to={`/category/${post.category}`} className="category-badge" data-category={post.category}>
              {CATEGORY_LABELS[post.category]}
            </Link>
            <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight text-foreground mb-4">
            {post.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            {post.description}
          </p>
          <div className="flex items-center gap-4">
            <div className="author-card py-3 px-4 inline-flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                {post.author.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <Link key={tag} to={`/tags/${tag}`} className="tag-chip">{tag}</Link>
            ))}
          </div>
          <div className="divider-fade mt-10" />
        </header>

        <div className="prose-blog">{renderContent(post.content)}</div>

        {/* CTA after post */}
        <div className="mt-14">
          <TelegramCTA variant="inline" />
        </div>

        {/* ─── Prev / Next navigation ─── */}
        {(prev || next) && (
          <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                to={`/blog/${prev.slug}`}
                className="content-card p-5 group flex flex-col gap-2 hover:shadow-md transition-shadow"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                  Previous post
                </span>
                <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-2">
                  {prev.title}
                </span>
                <time className="text-xs text-muted-foreground">{formatDate(prev.date)}</time>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                to={`/blog/${next.slug}`}
                className="content-card p-5 group flex flex-col gap-2 items-end text-right hover:shadow-md transition-shadow"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Next post
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </span>
                <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-2">
                  {next.title}
                </span>
                <time className="text-xs text-muted-foreground">{formatDate(next.date)}</time>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-heading font-bold text-foreground mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </article>
    </BlogLayout>
  );
};

export default BlogPost;
