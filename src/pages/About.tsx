import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import TelegramCTA from "@/components/TelegramCTA";
import SEOHead from "@/components/SEOHead";

const About = () => {
  return (
    <BlogLayout>
      <SEOHead
        title="About"
        description="About NSEinsider — independent market intelligence for Kenya's investors."
        path="/about"
        schemaType="page"
        keywords={["about NSEinsider", "NSE market intelligence", "Kenya investing"]}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" }
        ]}
      />
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
