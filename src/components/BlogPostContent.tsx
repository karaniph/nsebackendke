// src/components/BlogPostContent.tsx
import { useEffect, useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import ValuationSnapshotCard from "@/components/ValuationSnapshotCard";
import RiskMatrix from "@/components/RiskMatrix";
import GlossaryChips from "@/components/GlossaryChips";
import ChecklistCard from "@/components/ChecklistCard";
import { formatDate, CATEGORY_LABELS } from "@/lib/blog-data";
import type { PostHeading } from "@/lib/post-intelligence";
import { htmlToPlainText } from "@/lib/markdown";
import { loadFollowedTopics, saveFollowedTopics } from "@/lib/personalization";
import type { VisualBlocks } from "@/lib/visual-blocks";
import type { BlogPostCard } from "@/lib/blog-data";
import { BarChart3, Copy, Linkedin, Send, Share2, Twitter, MessageCircle, LineChart } from "lucide-react";
import ResearchToolsCTA from "@/components/ResearchToolsCTA";
import ResearchToolsLinks from "@/components/ResearchToolsLinks";
import { tradingViewSymbolUrl, TRADINGVIEW_INCENTIVE, AFFILIATE_REL, STOCK_ANALYSIS_AFF_URL, trackAffiliateClick } from "@/lib/affiliate";

interface BlogPostContentProps {
  /** Summary only — the body arrives pre-rendered as `contentHtml`. */
  post: BlogPostCard;
  /** Post body rendered to HTML at build time (no markdown lib on the client). */
  contentHtml: string;
  headings: PostHeading[];
  keyTakeaways: string[];
  readMinutes: number;
  sourceCount: number;
  visualBlocks: VisualBlocks;
  /** Related posts, already scored and trimmed at build time. */
  related: BlogPostCard[];
  prev: BlogPostCard | null;
  next: BlogPostCard | null;
  /** NSE ticker this post is clearly about (deep-dives / briefs) — enables TradingView deep-links. */
  tvTicker?: string | null;
}

const BlogPostContent = ({
  post,
  contentHtml,
  headings,
  keyTakeaways,
  readMinutes,
  sourceCount,
  visualBlocks,
  related,
  prev,
  next,
  tvTicker = null,
}: BlogPostContentProps) => {
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied" | "error">("idle");
  const [ttsState, setTtsState] = useState<"idle" | "playing" | "paused">("idle");

  const handleListen = () => {
    if (!window.speechSynthesis) return;
    if (ttsState === "playing") {
      window.speechSynthesis.pause();
      setTtsState("paused");
      return;
    }
    if (ttsState === "paused") {
      window.speechSynthesis.resume();
      setTtsState("playing");
      return;
    }
    window.speechSynthesis.cancel();
    const text = `${post.title}. ${post.description}. ${htmlToPlainText(contentHtml)}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setTtsState("idle");
    utterance.onerror = () => setTtsState("idle");
    window.speechSynthesis.speak(utterance);
    setTtsState("playing");
  };

  useEffect(() => {
    setFollowedTopics(loadFollowedTopics());
    setMounted(true);
  }, []);

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
  const clusterPosts = useMemo(() => related.slice(0, 4), [related]);
  const hubTags = useMemo(() => post.tags.slice(0, 3), [post.tags]);
  const shareUrl = `https://nseinsider.co.ke/blog/${post.slug}`;
  const shareText = `${post.title} — ${post.description}`;
  
  const primaryTopic = (post.tags[0] || post.category).toLowerCase();
  const topicFollowed = followedTopics.includes(primaryTopic);

  const toggleTopicFollow = () => {
    const next = topicFollowed ? followedTopics.filter((t) => t !== primaryTopic) : [...followedTopics, primaryTopic];
    setFollowedTopics(next);
    saveFollowedTopics(next);
  };

  const shareLinks = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
      icon: Twitter,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: Linkedin,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`,
      icon: MessageCircle,
    },
    {
      label: "Share on Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
      icon: Send,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback("copied");
      window.setTimeout(() => setCopyFeedback("idle"), 2000);
    } catch (_error) {
      setCopyFeedback("error");
      window.setTimeout(() => setCopyFeedback("idle"), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title: post.title,
        text: shareText,
        url: shareUrl,
      });
    } catch (_error) {
      // Ignore cancelled share sheets.
    }
  };

  const ctaConfig =
    post.category === "education"
      ? {
          title: "Turn this lesson into a habit",
          message: "Follow investor lessons on our Telegram channel and build your process week by week.",
          primaryLabel: "Join Telegram channel",
          primaryHref: "https://t.me/nseinsiderske",
          secondaryLabel: topicFollowed ? "Following topic" : "Follow this topic"
        }
      : post.category === "deep-dives"
        ? {
            title: "Track this stock in real time",
            message: "Follow fresh filings and deep-dive highlights on our Telegram channel.",
            primaryLabel: "Open Telegram channel",
            primaryHref: "https://t.me/nseinsiderske",
            secondaryLabel: topicFollowed ? "Following topic" : "Follow this topic"
          }
        : {
            title: "Get tomorrow's brief before open",
            message: "Follow pre-market context, key movers, and risk signals on our Telegram channel.",
            primaryLabel: "Read on Telegram",
            primaryHref: "https://t.me/nseinsiderske",
            secondaryLabel: topicFollowed ? "Following topic" : "Follow this topic"
          };

  return (
    <article className="container py-12 md:py-16 animate-in-up">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-10">
            <div className="max-w-3xl">
          <header className="mb-10">
            <div className="flex items-center gap-2.5 mb-4">
              <a href={`/category/${post.category}`} className="category-badge" data-category={post.category}>
                {CATEGORY_LABELS[post.category]}
              </a>
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
              <span className="rounded-full bg-secondary px-2.5 py-1">{Math.max(1, sourceCount)} verified source{Math.max(1, sourceCount) > 1 ? "s" : ""}</span>
              <span className="rounded-full bg-secondary px-2.5 py-1">Last updated {formatDate(post.updatedAt || post.date)}</span>
              {mounted && (
                <button
                  type="button"
                  onClick={handleListen}
                  className="rounded-full bg-secondary px-2.5 py-1 flex items-center gap-1 hover:bg-accent hover:text-white transition-colors"
                >
                  {ttsState === "playing" ? "⏸ Pause" : ttsState === "paused" ? "▶ Resume" : "🔊 Listen"}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <a key={tag} href={`/tags/${tag}`} className="tag-chip">{tag}</a>
              ))}
            </div>
            <section className="content-card mt-6 p-4 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Share this article</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Send this post to your team, channel, or investing circle.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="btn-outline inline-flex items-center gap-2 text-sm"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  )}
                  {shareLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline inline-flex items-center gap-2 text-sm"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label.replace("Share on ", "")}</span>
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="btn-outline inline-flex items-center gap-2 text-sm"
                  >
                    <Copy className="h-4 w-4" />
                    <span>
                      {copyFeedback === "copied"
                        ? "Link copied"
                        : copyFeedback === "error"
                          ? "Copy failed"
                          : "Copy link"}
                    </span>
                  </button>
                </div>
              </div>
            </section>
            <ResearchToolsLinks ticker={tvTicker} placement="article_top" />
            <section className="content-card mt-8 p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Build this topic cluster</p>
              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div>
                  <h2 className="text-lg font-heading font-bold text-foreground">Topical hubs</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use these internal paths to move from the current article into the broader category and tag coverage.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`/category/${post.category}`} className="btn-outline text-sm">
                      Browse {CATEGORY_LABELS[post.category]}
                    </a>
                    {hubTags.map((tag) => (
                      <a key={tag} href={`/tags/${tag}`} className="tag-chip">
                        #{tag}
                      </a>
                    ))}
                  </div>
                </div>
                {clusterPosts.length > 0 && (
                  <div className="rounded-2xl border border-border/70 bg-secondary/35 p-4">
                    <p className="text-sm font-semibold text-foreground">Also read in this cluster</p>
                    <div className="mt-3 space-y-3">
                      {clusterPosts.slice(0, 3).map((linkedPost) => (
                        <a key={linkedPost.slug} href={`/blog/${linkedPost.slug}`} className="block group">
                          <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                            {linkedPost.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {CATEGORY_LABELS[linkedPost.category]} · {formatDate(linkedPost.date)}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
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

          {tvTicker && (
            <a
              href={tradingViewSymbolUrl(tvTicker)}
              target="_blank"
              rel={AFFILIATE_REL}
              className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              <LineChart className="h-4 w-4 text-accent" />
              Analyze {tvTicker} technicals on TradingView →
            </a>
          )}

          <div className="prose-blog" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          <div className="mt-10">
            <ResearchToolsCTA ticker={tvTicker} placement="article" />
          </div>

          {mounted && (
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
          )}

          {/* ─── Prev / Next navigation ─── */}
          {(prev || next) && (
            <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prev ? (
                <a
                  href={`/blog/${prev.slug}`}
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
                </a>
              ) : (
                <div />
              )}
              {next ? (
                <a
                  href={`/blog/${next.slug}`}
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
                </a>
              ) : (
                <div />
              )}
            </nav>
          )}

          {/* Next Read */}
          {recommended.length > 0 && (
            <section className="mt-16">
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">Continue This Topic</h2>
                  <p className="text-sm text-muted-foreground">
                    Internal links to adjacent analysis help readers and crawlers move through the coverage cluster.
                  </p>
                </div>
                <a href={`/category/${post.category}`} className="text-sm text-accent hover:text-accent/80">
                  More {CATEGORY_LABELS[post.category]} →
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommended.map((p, i) => (
                  <PostCard key={p.slug} post={p} index={i} />
                ))}
              </div>
              {hubTags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {hubTags.map((tag) => (
                    <a key={tag} href={`/tags/${tag}`} className="tag-chip">
                      More on {tag}
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}
            </div>

            {headings.length > 0 && (
              <aside className="hidden xl:block">
                <div className="sticky top-24 space-y-4">
                  <div className="content-card p-5">
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
                  <div className="content-card p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-3">Topic authority links</p>
                    <div className="space-y-2">
                      <a href={`/category/${post.category}`} className="block text-sm text-foreground hover:text-accent transition-colors">
                        {CATEGORY_LABELS[post.category]} hub
                      </a>
                      {hubTags.map((tag) => (
                        <a key={tag} href={`/tags/${tag}`} className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                          Tag: {tag}
                        </a>
                      ))}
                    </div>
                    {clusterPosts.length > 0 && (
                      <div className="mt-4 border-t border-border/70 pt-4 space-y-3">
                        {clusterPosts.slice(0, 3).map((linkedPost) => (
                          <a key={linkedPost.slug} href={`/blog/${linkedPost.slug}`} className="block group">
                            <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                              {linkedPost.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">{formatDate(linkedPost.date)}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {tvTicker && (
                    <div className="content-card p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Chart it</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Open {tvTicker} on TradingView for live charts and indicators. {TRADINGVIEW_INCENTIVE}.
                      </p>
                      <a
                        href={tradingViewSymbolUrl(tvTicker)}
                        target="_blank"
                        rel={AFFILIATE_REL}
                        onClick={() => trackAffiliateClick("tradingview", "article_sidebar")}
                        className="btn-brand w-full justify-center text-sm"
                      >
                        <LineChart className="h-4 w-4" />
                        Chart {tvTicker}
                      </a>
                      <a
                        href={STOCK_ANALYSIS_AFF_URL}
                        target="_blank"
                        rel={AFFILIATE_REL}
                        onClick={() => trackAffiliateClick("stock_analysis", "article_sidebar")}
                        className="btn-outline mt-2 w-full justify-center text-sm"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Research financials
                      </a>
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>
    </article>
  );
};

export default BlogPostContent;
