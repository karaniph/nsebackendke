// src/components/IndexContent.tsx
import { useEffect, useMemo, useState } from "react";
// Since we mapped paths in Vite using "@", let's ensure Astro respects it or use relative paths.
import PostCard from "@/components/PostCard";
import TelegramCTA from "@/components/TelegramCTA";
import { extractKeyTakeaways, inferMarketMood } from "@/lib/post-intelligence";
import { DEFAULT_TOPICS, getPersonalizedPosts, loadFollowedTopics, saveFollowedTopics } from "@/lib/personalization";
import type { BlogPost, BlogPostSummary } from "@/lib/blog-data";

interface IndexContentProps {
  allPosts: BlogPostSummary[];
  marketBriefs: BlogPostSummary[];
  deepDives: BlogPostSummary[];
  education: BlogPostSummary[];
  botUpdates: BlogPostSummary[];
  todayBrief?: BlogPost; // Keep todayBrief as full object for takeaways
}

const IndexContent = ({ allPosts, marketBriefs, deepDives, education, botUpdates, todayBrief }: IndexContentProps) => {
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  // Avoid hydration mismatch by only rendering user-specific FollowedTopics after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFollowedTopics(loadFollowedTopics());
    setMounted(true);
  }, []);

  const toggleTopic = (topic: string) => {
    const normalized = topic.toLowerCase();
    const next = followedTopics.includes(normalized)
      ? followedTopics.filter((t) => t !== normalized)
      : [...followedTopics, normalized];
    setFollowedTopics(next);
    saveFollowedTopics(next);
  };

  const personalizedPosts = useMemo(
    () => getPersonalizedPosts(allPosts, followedTopics, 4),
    [allPosts, followedTopics]
  );
  
  const todayTakeaways = todayBrief ? extractKeyTakeaways(todayBrief.content, 3) : [];
  const marketMood = todayBrief ? inferMarketMood(todayBrief.content) : "Mixed";

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* ─── Hero ─── */}
        <section className="container py-16 md:py-24 animate-in-up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Tracking the Nairobi Securities Exchange
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] text-foreground">
              Market intelligence{" "}
              <span className="text-muted-foreground">for Kenya's investors</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed max-w-xl">
              Weekly market briefs, company deep dives, and practical education — everything you need to make informed decisions on the NSE.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a href="https://t.me/nseinsiderske" target="_blank" rel="noopener noreferrer" className="btn-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Join Telegram Channel
              </a>
              <a href="/category/market-briefs" className="btn-outline">
                Read Latest Brief →
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("nseinsider:open-advisor"))}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Ask the NSE Advisor · KES 500/mo
              </button>
              <a href="/investment-advisor" className="btn-outline">
                See How It Works →
              </a>
              <a
                href="https://www.tradingview.com/markets/stocks-kenya/?aff_id=170183"
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
                Chart NSE on TradingView
              </a>
            </div>
          </div>
        </section>

        <section id="investment-advisor" className="container py-8 md:py-10" aria-labelledby="advisor-heading">
          <div className="content-card border-l-4 border-l-primary p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">New · NSEinsider Chat Pro</p>
                <h2 id="advisor-heading" className="mt-2 text-2xl font-heading font-bold">AI investment advisor for Kenya's NSE</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Tell the advisor your budget, risk appetite, and time horizon. It uses NSE filings, market events, and current market research to help you explore a practical strategy — from KES 10,000 portfolios to company-specific questions.
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">KES 500/month · up to 100 advisor messages · cancel through Paystack</p>
              </div>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("nseinsider:open-advisor"))}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Start a private advisor chat
              </button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">Educational information only — not licensed financial advice. Review every suggestion independently.</p>
          </div>
        </section>

        <div className="container"><div className="divider-fade" /></div>

        {/* ─── Today in 30 Seconds ─── */}
        {todayBrief && (
          <section className="container py-8 md:py-10">
            <div className="content-card p-6 md:p-7 border-l-4 border-l-accent">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Today in 30 Seconds</p>
                  <h2 className="text-xl font-heading font-bold mt-1">Quick NSE Snapshot</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  <span>Market mood:</span>
                  <span className={`stat-pill ${marketMood === "Bullish" ? "up" : marketMood === "Bearish" ? "down" : ""}`}>{marketMood}</span>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-foreground/90">
                {todayTakeaways.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={`/blog/${todayBrief.slug}`} className="btn-outline">Read full brief</a>
                <a href="https://t.me/nseinsiderske" target="_blank" rel="noopener noreferrer" className="btn-brand">Join Telegram channel</a>
              </div>
            </div>
          </section>
        )}

        {/* ─── Personalization ─── */}
        <section className="container py-8 md:py-10">
          <div className="content-card p-6 md:p-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-xl font-heading font-bold">Follow topics</h2>
                <p className="text-sm text-muted-foreground mt-1">Pick topics once. We'll prioritize relevant stories next visit.</p>
              </div>
              {mounted && <span className="text-xs text-muted-foreground">{followedTopics.length} selected</span>}
            </div>
            {mounted && (
              <div className="mt-4 flex flex-wrap gap-2">
                {DEFAULT_TOPICS.map((topic) => {
                  const active = followedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`tag-chip ${active ? "border-border text-foreground bg-secondary" : ""}`}
                    >
                      {active ? "✓ " : ""}{topic.replace(/-/g, " ")}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {mounted && personalizedPosts.length > 0 && (
          <section className="container py-8 md:py-10">
            <div className="section-header">
              <div>
                <h2>Personalized For You</h2>
                <p className="text-sm text-muted-foreground mt-1">Based on your followed topics</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {personalizedPosts.map((post, i) => (
                <PostCard key={post.slug} post={post as any} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ─── Latest Posts ─── */}
        <section className="container py-12 md:py-16">
          <div className="section-header">
            <h2>Latest Analysis</h2>
            <a href="/tags">All posts →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {allPosts.slice(0, 4).map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} asAstroLink />
            ))}
          </div>
        </section>

        {/* ─── Market Briefs ─── */}
        {marketBriefs.length > 0 && (
          <section className="container py-12 md:py-16">
            <div className="section-header">
              <div>
                <h2>Market Briefs</h2>
                <p className="text-sm text-muted-foreground mt-1">Weekly NSE performance summaries and key movers</p>
              </div>
              <a href="/category/market-briefs">View all →</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketBriefs.slice(0, 2).map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} asAstroLink />
              ))}
            </div>
            <div className="content-card mt-5 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-sm text-muted-foreground">Need tomorrow's opening setup early? Follow the Telegram channel before market chatter takes over.</p>
              <a href="https://t.me/nseinsiderske" target="_blank" rel="noopener noreferrer" className="btn-brand text-sm">Read updates on Telegram</a>
            </div>
          </section>
        )}

        {/* ─── CTA ─── */}
        <section className="container py-8">
          <TelegramCTA />
        </section>

        {/* ─── Deep Dives + Education side by side ─── */}
        <section className="container py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Deep Dives */}
            <div>
              <div className="section-header">
                <h2>Company Deep Dives</h2>
                <a href="/category/deep-dives">View all →</a>
              </div>
              <div className="space-y-0">
                {deepDives.length > 0 ? (
                  deepDives.slice(0, 3).map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} variant="compact" asAstroLink />
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </div>
                    <p className="text-sm text-muted-foreground">Deep dives coming soon.</p>
                  </div>
                )}
              </div>
              <div className="content-card mt-5 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-muted-foreground">Track specific stocks with live prompts and get notified when a new deep dive drops.</p>
                <a href="https://t.me/nseinsiderske" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">Follow market updates on Telegram</a>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="section-header">
                <h2>Investor Education</h2>
                <a href="/category/education">View all →</a>
              </div>
              <div className="space-y-0">
                {education.length > 0 ? (
                  education.slice(0, 3).map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} variant="compact" asAstroLink />
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </div>
                    <p className="text-sm text-muted-foreground">Education content coming soon.</p>
                  </div>
                )}
              </div>
              <div className="content-card mt-5 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-muted-foreground">Build investor skills weekly with short lessons you can save and revisit.</p>
                <a href="/category/education" className="btn-outline text-sm">Start learning path</a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bot Updates ─── */}
        {botUpdates.length > 0 && (
          <section className="container py-12 md:py-16">
            <div className="section-header">
              <div>
                <h2>Bot Updates</h2>
                <p className="text-sm text-muted-foreground mt-1">What's new on the NSEinsider Telegram channel</p>
              </div>
              <a href="/category/bot-updates">View all →</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {botUpdates.slice(0, 2).map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} asAstroLink />
              ))}
            </div>
          </section>
        )}

        {/* ─── Newsletter ─── */}
        <section className="container py-12 md:py-16">
          <TelegramCTA variant="inline" />
        </section>
      </div>
    </>
  );
};

export default IndexContent;
