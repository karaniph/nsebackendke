import { useParams, Link, Navigate } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import SEOHead from "@/components/SEOHead";
import { getPostBySlug, formatDate } from "@/lib/blog-data";

/** Extremely simple markdown-to-HTML for our controlled content */
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let key = 0;

  const processInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    // Process inline code, bold, italic, links
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const m = match[0];
      if (m.startsWith("`")) {
        parts.push(<code key={`i${key++}`} className="bg-secondary px-1.5 py-0.5 rounded-sm text-sm">{m.slice(1, -1)}</code>);
      } else if (m.startsWith("**")) {
        parts.push(<strong key={`i${key++}`}>{m.slice(2, -2)}</strong>);
      } else if (m.startsWith("*")) {
        parts.push(<em key={`i${key++}`}>{m.slice(1, -1)}</em>);
      } else if (m.startsWith("[")) {
        const linkMatch = m.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          parts.push(<a key={`i${key++}`} href={linkMatch[2]} className="underline underline-offset-4 decoration-accent hover:text-accent transition-colors">{linkMatch[1]}</a>);
        }
      }
      lastIndex = match.index + m.length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : [text];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={key++} className="bg-secondary rounded-sm p-4 overflow-x-auto my-8 text-sm leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === "") continue;

    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-2xl font-heading font-semibold mt-16 mb-6">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-xl font-heading font-semibold mt-12 mb-4">{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={key++} className="border-l-2 border-accent pl-6 my-8 italic text-muted-foreground">
          {processInline(line.slice(2))}
        </blockquote>
      );
    } else if (line.startsWith("- ")) {
      // Collect list items
      const items: string[] = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith("- ")) {
        i++;
        items.push(lines[i].slice(2));
      }
      elements.push(
        <ul key={key++} className="mb-6 pl-6">
          {items.map((item, j) => (
            <li key={j} className="list-disc mb-2">{processInline(item)}</li>
          ))}
        </ul>
      );
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [line.replace(/^\d+\. /, "")];
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i + 1])) {
        i++;
        items.push(lines[i].replace(/^\d+\. /, ""));
      }
      elements.push(
        <ol key={key++} className="mb-6 pl-6">
          {items.map((item, j) => (
            <li key={j} className="list-decimal mb-2">{processInline(item)}</li>
          ))}
        </ol>
      );
    } else {
      elements.push(<p key={key++} className="mb-6">{processInline(line)}</p>);
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
      <article>
        <header className="mb-16">
          <time className="text-sm text-muted-foreground">{formatDate(post.date)}</time>
          <h1 className="text-3xl font-heading font-bold mt-2 mb-4">{post.title}</h1>
          <p className="text-muted-foreground text-sm">{post.author}</p>
          <div className="flex gap-3 mt-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>
        <div className="prose-blog">
          {renderContent(post.content)}
        </div>
      </article>
    </BlogLayout>
  );
};

export default BlogPost;
