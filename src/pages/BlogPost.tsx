import { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import PostCard from "@/components/PostCard";
import SEOHead from "@/components/SEOHead";
import ValuationSnapshotCard from "@/components/ValuationSnapshotCard";
import RiskMatrix from "@/components/RiskMatrix";
import GlossaryChips from "@/components/GlossaryChips";
import ChecklistCard from "@/components/ChecklistCard";
import { useLivePosts } from "@/hooks/use-live-posts";
import { getPostBySlugFrom, getRelatedPostsFrom, getAdjacentPostsFrom, formatDate, CATEGORY_LABELS } from "@/lib/blog-data";
import { estimateReadingMinutes, extractHeadings, extractKeyTakeaways, extractSourceUrls, getCategoryOgImage, getPostMetaDescription, slugifyHeading } from "@/lib/post-intelligence";
import { loadFollowedTopics, saveFollowedTopics } from "@/lib/personalization";
import { buildVisualBlocks } from "@/lib/visual-blocks";

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  const headingSeen = new Map<string, number>();
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
        if (linkMatch) parts.push(<a key={`i${key++}`} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>);
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
      const text = line.slice(3);
      const base = slugifyHeading(text);
      const count = (headingSeen.get(base) || 0) + 1;
      headingSeen.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;
      elements.push(<h2 key={key++} id={id}>{text}</h2>);
    } else if (line.startsWith("### ")) {
      const text = line.slice(4);
      const base = slugifyHeading(text);
      const count = (headingSeen.get(base) || 0) + 1;
      headingSeen.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;
      elements.push(<h3 key={key++} id={id}>{text}</h3>);
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
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const posts = data || [];
  const post = slug ? getPostBySlugFrom(posts, slug) : undefined;

  useEffect(() => {
    setFollowedTopics(loadFollowedTopics());
  }, []);

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

  const related = getRelatedPostsFrom(posts, post, 6);
  const { prev, next } = getAdjacentPostsFrom(posts, post.slug);
  const headings = extractHeadings(post.content);
  const readMinutes = estimateReadingMinutes(post.content);
  const sources = extractSourceUrls(post.content);
  const keyTakeaways = extractKeyTakeaways(post.content, 3);
  const visualBlocks = buildVisualBlocks(post);
  const recommended = useMemo(
    () =>
      related
        .sort((a, b) => {
          const aScore = (a.category === post.category ? 3 : 0) + a.tags.filter((t) => post.tags.includes(t)).length;
          const bScore = (b.category === post.category ? 3 : 0) + b.tags.filter((t) => post.tags.includes(t)).length;
          return bScore - aScore;
        })
        .slice(0, 3),
    [related, post]
  );
  const metaDescription = getPostMetaDescription(post);
  const ogImage = getCategoryOgImage(post.category);
  const primaryTopic = (post.tags[0] || post.category).toLowerCase();
  const topicFollowed = followedTopics.includes(primaryTopic);

  const toggleTopicFollow = () => {
    const next = topicFollowed ? followedTopics.filter((t) => t !== primaryTopic) : [...followedTopics, primaryTopic];
    setFollowedTopics(next);
    saveFollowedTopics(next);
  };

  const faq =
    post.category === "education"
      ? [
          {
            question: `What is the main lesson in "${post.title}"?`,
            answer: keyTakeaways[0] || post.description
          },
          {
            question: "How can I apply this on the NSE today?",
            answer: keyTakeaways[1] || "Use the checklist in the article before entering any position."
          },
          {
            question: "Is this investment advice?",
            answer: "No. This is educational content for decision support and research discipline."
          }
        ]
      : undefined;

  const ctaConfig =
    post.category === "education"
      ? {
          title: "Turn this lesson into a habit",
          message: "Get practical investor lessons in Telegram and build your process week by week.",
          primaryLabel: "Get the next lesson",
          primaryHref: "https://t.me/NSEInsider_bot",
          secondaryLabel: topicFollowed ? "Following topic" : "Follow this topic"
        }
      : post.category === "deep-dives"
        ? {
            title: "Track this stock in real time",
            message: "Set alerts and follow fresh filings in Telegram before the next deep dive lands.",
            primaryLabel: "Track on Telegram",
            primaryHref: "https://t.me/NSEInsider_bot",
            secondaryLabel: topicFollowed ? "Following topic" : "Follow this topic"
          }
        : {
            title: "Get tomorrow's brief before open",
            message: "Receive pre-market context, key movers, and risk signals directly on Telegram.",
            primaryLabel: "Get morning alert",
            primaryHref: "https://t.me/NSEInsider_bot",
            secondaryLabel: topicFollowed ? "Following topic" : "Follow this topic"
          };

  return (
    <BlogLayout>
      <SEOHead
        title={post.title}
        description={metaDescription}
        path={`/blog/${post.slug}`}
        type="article"
        publishedDate={post.date}
        modifiedDate={post.updatedAt || post.date}
        author={post.author}
        section={CATEGORY_LABELS[post.category]}
        keywords={post.tags}
        image={ogImage}
        faq={faq}
        schemaType="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: CATEGORY_LABELS[post.category], path: `/category/${post.category}` },
          { name: post.title, path: `/blog/${post.slug}` }
        ]}
      />
      <article className="container py-12 md:py-16 animate-in-up">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-10">
          <div className="max-w-3xl">
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
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-secondary px-2.5 py-1">{readMinutes} min read</span>
            <span className="rounded-full bg-secondary px-2.5 py-1">{Math.max(1, sources.length)} verified source{Math.max(1, sources.length) > 1 ? "s" : ""}</span>
            <span className="rounded-full bg-secondary px-2.5 py-1">Last updated {formatDate(post.updatedAt || post.date)}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <Link key={tag} to={`/tags/${tag}`} className="tag-chip">{tag}</Link>
            ))}
          </div>
          <div className="divider-fade mt-10" />
        </header>

        {keyTakeaways.length > 0 && (
          <section className="content-card p-5 md:p-6 mb-8 border-l-4 border-l-accent">
            <h2 className="text-lg font-heading font-bold">Key Takeaways</h2>
            <ul className="mt-3 space-y-2 text-sm text-foreground/90">
              {keyTakeaways.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {post.category === "deep-dives" && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <ValuationSnapshotCard metrics={visualBlocks.valuationSnapshot} />
            <RiskMatrix items={visualBlocks.riskMatrix} />
          </section>
        )}

        {post.category === "education" && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <GlossaryChips items={visualBlocks.glossary} />
            <ChecklistCard items={visualBlocks.checklist} />
          </section>
        )}

        <div className="prose-blog">{renderContent(post.content)}</div>

        <div className="mt-14 content-card p-6 md:p-7">
          <h3 className="text-xl font-heading font-bold">{ctaConfig.title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{ctaConfig.message}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={ctaConfig.primaryHref} target="_blank" rel="noopener noreferrer" className="btn-brand">
              {ctaConfig.primaryLabel}
            </a>
            <button type="button" onClick={toggleTopicFollow} className="btn-outline">
              {ctaConfig.secondaryLabel}
            </button>
          </div>
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

        {/* Next Read */}
        {recommended.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-heading font-bold text-foreground mb-6">Next Read</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </section>
        )}
          </div>

          {headings.length > 0 && (
            <aside className="hidden xl:block">
              <div className="sticky top-24 content-card p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-3">On this page</p>
                <nav className="space-y-2">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`block text-sm hover:text-accent transition-colors ${heading.level === 3 ? "pl-4 text-muted-foreground" : "text-foreground"}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </article>
    </BlogLayout>
  );
};

export default BlogPost;
