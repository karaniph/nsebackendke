import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import PostCard from "@/components/PostCard";
import TelegramCTA from "@/components/TelegramCTA";
import SEOHead from "@/components/SEOHead";
import {
  getPublishedPosts,
  getPostsByCategory,
} from "@/lib/blog-data";

const Index = () => {
  const allPosts = getPublishedPosts();
  const marketBriefs = getPostsByCategory("market-briefs");
  const deepDives = getPostsByCategory("deep-dives");
  const education = getPostsByCategory("education");
  const botUpdates = getPostsByCategory("bot-updates");

  return (
    <BlogLayout>
      <SEOHead
        title="NSEinsider — Kenya's Market Intelligence Platform"
        description="Independent analysis, company deep dives, and investor education for the Nairobi Securities Exchange. Join 5,000+ investors."
      />

      {/* ─── Ticker Bar ─── */}
      <div className="ticker-bar overflow-hidden py-2 text-xs font-mono">
        <div className="ticker-scroll flex items-center gap-8 whitespace-nowrap">
          <span>NASI <span className="stat-pill up">▲ 1.8%</span></span>
          <span>SCOM <span className="stat-pill up">▲ 1.5%</span> 28.40</span>
          <span>KCB <span className="stat-pill up">▲ 4.2%</span> 42.50</span>
          <span>EQTY <span className="stat-pill up">▲ 3.1%</span> 51.75</span>
          <span>BAT <span className="stat-pill down">▼ 2.1%</span> 345.00</span>
          <span>BAMB <span className="stat-pill down">▼ 1.6%</span> 32.50</span>
          <span>EABL <span className="stat-pill down">▼ 0.8%</span> 165.00</span>
          <span>COOP <span className="stat-pill up">▲ 2.8%</span> 14.90</span>
          {/* Duplicate for seamless scroll */}
          <span>NASI <span className="stat-pill up">▲ 1.8%</span></span>
          <span>SCOM <span className="stat-pill up">▲ 1.5%</span> 28.40</span>
          <span>KCB <span className="stat-pill up">▲ 4.2%</span> 42.50</span>
          <span>EQTY <span className="stat-pill up">▲ 3.1%</span> 51.75</span>
          <span>BAT <span className="stat-pill down">▼ 2.1%</span> 345.00</span>
          <span>BAMB <span className="stat-pill down">▼ 1.6%</span> 32.50</span>
          <span>EABL <span className="stat-pill down">▼ 0.8%</span> 165.00</span>
          <span>COOP <span className="stat-pill up">▲ 2.8%</span> 14.90</span>
        </div>
      </div>

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
            <a href="https://t.me/NSEinsiderBot" target="_blank" rel="noopener noreferrer" className="btn-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Get Free Alerts
            </a>
            <Link to="/category/market-briefs" className="btn-outline">
              Read Latest Brief →
            </Link>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider-fade" /></div>

      {/* ─── Latest Posts ─── */}
      <section className="container py-12 md:py-16">
        <div className="section-header">
          <h2>Latest Analysis</h2>
          <Link to="/tags">All posts →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {allPosts.slice(0, 4).map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
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
            <Link to="/category/market-briefs">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketBriefs.slice(0, 2).map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
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
              <Link to="/category/deep-dives">View all →</Link>
            </div>
            <div className="space-y-0">
              {deepDives.length > 0 ? (
                deepDives.slice(0, 3).map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} variant="compact" />
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
          </div>

          {/* Education */}
          <div>
            <div className="section-header">
              <h2>Investor Education</h2>
              <Link to="/category/education">View all →</Link>
            </div>
            <div className="space-y-0">
              {education.length > 0 ? (
                education.slice(0, 3).map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} variant="compact" />
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
          </div>
        </div>
      </section>

      {/* ─── Bot Updates ─── */}
      {botUpdates.length > 0 && (
        <section className="container py-12 md:py-16">
          <div className="section-header">
            <div>
              <h2>Bot Updates</h2>
              <p className="text-sm text-muted-foreground mt-1">What's new with the NSEinsider Telegram Bot</p>
            </div>
            <Link to="/category/bot-updates">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {botUpdates.slice(0, 2).map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Newsletter ─── */}
      <section className="container py-12 md:py-16">
        <TelegramCTA variant="inline" />
      </section>
    </BlogLayout>
  );
};

export default Index;
