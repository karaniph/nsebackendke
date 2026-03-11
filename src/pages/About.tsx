import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import TelegramCTA from "@/components/TelegramCTA";
import SEOHead from "@/components/SEOHead";

const About = () => {
  return (
    <BlogLayout>
      <SEOHead title="About" description="About NSEinsider — independent market intelligence for Kenya's investors." path="/about" />
      <div className="container py-12 md:py-16 max-w-3xl animate-in-up">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
          Independent market intelligence for Kenya
        </h1>

        <div className="prose-blog">
          <p>
            NSEinsider was built to solve a simple problem: retail investors at the Nairobi Securities Exchange deserve the same quality of analysis that institutional investors get.
          </p>
          <p>
            We publish weekly market briefs, company deep dives, and practical education content — all designed to help you make informed investment decisions on the NSE. No hype, no tips, no pump-and-dump. Just rigorous, independent analysis.
          </p>

          <h2>What We Cover</h2>
          <ul>
            <li><strong>Market Briefs</strong> — Weekly roundups of NSE performance, top movers, and macroeconomic context</li>
            <li><strong>Company Deep Dives</strong> — Detailed analysis of individual NSE counters including valuation, strategy, and risk assessment</li>
            <li><strong>Investor Education</strong> — Practical guides to reading financial statements, understanding ratios, and building a portfolio</li>
            <li><strong>Bot Updates</strong> — New features and tips for the NSEinsider Telegram Bot</li>
          </ul>

          <h2>The Team</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div className="author-card">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground shrink-0">BM</div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Brian Mwenda</h3>
              <p className="text-sm text-muted-foreground">Market Analyst</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">CFA Level III candidate. Previously at Genghis Capital. Covers banking, telco, and macro.</p>
            </div>
          </div>
          <div className="author-card">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground shrink-0">AO</div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Amara Osei</h3>
              <p className="text-sm text-muted-foreground">Education Lead</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Former investment banking analyst. Passionate about financial literacy across East Africa.</p>
            </div>
          </div>
          <div className="author-card">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground shrink-0">KN</div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Kevin Njoroge</h3>
              <p className="text-sm text-muted-foreground">Product Lead</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Full-stack developer building the NSEinsider Bot. Ex-Safaricom engineering.</p>
            </div>
          </div>
        </div>

        <div className="prose-blog">
          <h2>Disclaimer</h2>
          <p>
            NSEinsider provides market analysis and education for informational purposes only. Nothing published here constitutes investment advice, a solicitation to buy or sell securities, or a recommendation of any kind. Always do your own research and consult a licensed financial advisor before making investment decisions.
          </p>
        </div>

        <div className="mt-12">
          <TelegramCTA />
        </div>
      </div>
    </BlogLayout>
  );
};

export default About;
