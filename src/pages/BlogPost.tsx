import { useParams, Link, Navigate } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import SEOHead from "@/components/SEOHead";
import { getPostBySlug, formatDate } from "@/lib/blog-data";

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
        parts.push(<strong key={`i${key++}`} className="text-foreground font-semibold">{m.slice(2, -2)}</strong>);
      } else if (m.startsWith("*")) {
        parts.push(<em key={`i${key++}`}>{m.slice(1, -1)}</em>);
      } else if (m.startsWith("[")) {
        const linkMatch = m.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          parts.push(<a key={`i${key++}`} href={linkMatch[2]}>{linkMatch[1]}</a>);
        }
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
        elements.push(
          <pre key={key++}><code>{codeLines.join("\n")}</code></pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
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
      elements.push(
        <ul key={key++}>{items.map((item, j) => <li key={j}>{processInline(item)}</li>)}</ul>
      );
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [line.replace(/^\d+\. /, "")];
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i + 1])) { i++; items.push(lines[i].replace(/^\d+\. /, "")); }
      elements.push(
        <ol key={key++}>{items.map((item, j) => <li key={j}>{processInline(item)}</li>)}</ol>
      );
    } else {
      elements.push(<p key={key++}>{processInline(line)}</p>);
    }
  }
  return elements;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/404" replace />;

  return (
    <BlogLayout>
      <SEOHead
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        publishedDate={post.date}
        author={post.author}
      />
      <article className="animate-in-up">
        <header className="pt-12 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <time className="text-xs text-muted-foreground font-mono">{formatDate(post.date)}</time>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-xs text-muted-foreground">{post.author}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight text-foreground mb-6">
            {post.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <Link key={tag} to={`/tags/${tag}`} className="tag-chip">{tag}</Link>
            ))}
          </div>
          <div className="divider-fade mt-12" />
        </header>
        <div className="prose-blog">
          {renderContent(post.content)}
        </div>
      </article>
    </BlogLayout>
  );
};

export default BlogPost;
