export type PostCategory = "market-briefs" | "deep-dives" | "education" | "bot-updates";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  authorRole: string;
  tags: string[];
  category: PostCategory;
  coverImage: string;
  draft: boolean;
  content: string;
  blocks?: {
    valuationSnapshot?: Array<{ label: string; value: string; signal?: "positive" | "neutral" | "negative" }>;
    riskMatrix?: Array<{ risk: string; likelihood: "low" | "medium" | "high"; impact: "low" | "medium" | "high" }>;
    glossary?: Array<{ term: string; definition: string }>;
    checklist?: string[];
  };
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  "market-briefs": "Market Brief",
  "deep-dives": "Deep Dive",
  "education": "Education",
  "bot-updates": "Bot Update",
};

export const blogPosts: BlogPost[] = [
  {
    slug: "nse-weekly-wrap-march-2026",
    title: "NSE Weekly Wrap: NASI Gains 1.8% as Banking Stocks Rally",
    description: "The Nairobi All-Share Index closed the week higher, driven by renewed investor interest in KCB, Equity, and Co-operative Bank. Here's what moved the market.",
    date: "2026-03-07",
    author: "Brian Mwenda",
    authorRole: "Market Analyst",
    tags: ["nse", "weekly-wrap", "banking", "nasi"],
    category: "market-briefs",
    coverImage: "",
    draft: false,
    content: `## Market Overview

The Nairobi Securities Exchange posted a strong week, with the NASI closing at 112.45 — up 1.8% from last Friday's 110.47. Total market turnover hit KES 3.2 billion, a 22% increase week-on-week, signalling renewed institutional interest.

Banking stocks led the rally, with the sector index gaining 2.4%. The positive momentum was attributed to strong Q4 2025 earnings previews and expectations of a further CBK rate cut in April.

## Top Movers

**Gainers:**

- KCB Group: +4.2% to KES 42.50 — strong Q4 earnings preview
- Equity Group: +3.1% to KES 51.75 — regional expansion narrative
- Co-operative Bank: +2.8% to KES 14.90 — dividend expectations
- Safaricom: +1.5% to KES 28.40 — stable ARPU growth

**Losers:**

- BAT Kenya: -2.1% to KES 345.00 — regulatory concerns
- Bamburi Cement: -1.6% to KES 32.50 — construction slowdown
- East African Breweries: -0.8% to KES 165.00 — profit-taking

## What to Watch Next Week

1. CBK's Monetary Policy Committee meets Tuesday — consensus expects a 25bps cut to 10.5%
2. Safaricom half-year results due Wednesday
3. Treasury bond auction on Thursday with strong demand expected

> The banking sector is repricing ahead of rate cuts. We expect this trend to continue through Q2, though selectivity will matter — not all banks are positioned equally for a lower-rate environment.

## Foreign Investor Activity

Net foreign selling continued but at a reduced pace — KES 180M net outflows vs. KES 420M the prior week. This suggests the sell-off is moderating, which is typically a bullish signal for the medium term.

The shilling held steady at 128.50 against the dollar, providing a stable backdrop for equities.`,
  },
  {
    slug: "safaricom-deep-dive-2026",
    title: "Safaricom: Is the M-Pesa Growth Story Fully Priced In?",
    description: "A comprehensive look at Safaricom's valuation, M-Pesa's expansion into Ethiopia, and whether the stock still offers upside at current levels.",
    date: "2026-02-28",
    author: "Brian Mwenda",
    authorRole: "Market Analyst",
    tags: ["safaricom", "m-pesa", "valuation", "ethiopia"],
    category: "deep-dives",
    coverImage: "",
    draft: false,
    content: `## The Investment Thesis

Safaricom remains the most actively traded counter on the NSE, accounting for roughly 40% of daily turnover. At KES 28.40, it trades at 14.2x forward earnings — a premium to the broader market but a discount to its five-year average of 17x.

The bull case rests on three pillars: continued M-Pesa dominance in Kenya, the Ethiopia opportunity, and the 5G rollout. The bear case centres on regulatory risk, the capital-intensive Ethiopia expansion, and slowing domestic subscriber growth.

## M-Pesa: Still the Engine

M-Pesa revenue grew 18% year-on-year to KES 120 billion in FY2025, driven by:

- **Transaction volume growth** — 17.2 billion transactions, up from 15.1 billion
- **Super app expansion** — merchant payments, credit, and savings products
- **Cross-border remittances** — growing at 35% annually

The key metric to watch is revenue per transaction, which has been declining as micro-transactions grow. This is actually healthy — it means the platform is deepening financial inclusion — but it does moderate revenue growth expectations.

## Ethiopia: The Optionality Play

Safaricom Ethiopia has 8.2 million subscribers after 30 months of operations. The company invested KES 85 billion in the network and has targeted breakeven by FY2028.

**Risks:**

- Mobile money license delays (still pending government approval)
- Forex repatriation challenges
- Intense competition from Ethio Telecom's established base of 72 million subscribers

**Upside:**

- If M-Pesa launches in Ethiopia by H2 2026, it would be a significant catalyst
- Ethiopia's 120 million population represents a massive addressable market
- Current Safaricom valuation arguably assigns zero value to Ethiopia operations

## Valuation Framework

\`\`\`
Metric          Current   5Y Avg   Peer Avg
──────────────────────────────────────────────
P/E (Forward)   14.2x     17.0x    12.5x
EV/EBITDA       8.1x      9.5x     7.2x
Div Yield       5.8%      4.5%     3.2%
ROE             28.4%     32.1%    18.5%
\`\`\`

At current levels, the stock is pricing in moderate growth but not the Ethiopia optionality. Our fair value estimate is KES 34.00, implying 20% upside.

> We rate Safaricom a **Buy** with a 12-month target of KES 34.00. The risk-reward is compelling given the Ethiopia optionality and the 5.8% dividend yield providing downside protection.

## Key Risks

1. Regulatory changes to M-Pesa pricing could compress margins
2. Ethiopia mobile money license further delayed
3. 5G capex exceeds projections
4. Shilling depreciation impacts Ethiopia investment returns`,
  },
  {
    slug: "how-to-read-nse-financial-statements",
    title: "How to Read NSE Financial Statements Like a Pro",
    description: "A practical guide to understanding balance sheets, income statements, and cash flow reports from NSE-listed companies — no finance degree required.",
    date: "2026-02-15",
    author: "Amara Osei",
    authorRole: "Education Lead",
    tags: ["education", "fundamentals", "financial-analysis", "beginners"],
    category: "education",
    coverImage: "",
    draft: false,
    content: `## Why This Matters

Every NSE-listed company publishes financial statements quarterly and annually. These documents tell you more about a company's health than any analyst's opinion or WhatsApp tip. Learning to read them gives you an information edge that 90% of retail investors at the NSE don't have.

We'll break down the three core statements using real examples from NSE-listed companies.

## The Income Statement

The income statement answers one question: **Did the company make money over this period?**

Key lines to focus on:

- **Revenue (Turnover):** Total sales. Is it growing year-on-year?
- **Operating Profit (EBIT):** Revenue minus operating costs. This tells you about the core business performance.
- **Net Profit:** The bottom line after tax and interest. This is what's available to shareholders.

**What to watch for:**

- Revenue growing but profits shrinking = margins under pressure
- One-time gains inflating profits = not sustainable
- Interest costs eating into operating profit = too much debt

## The Balance Sheet

The balance sheet is a snapshot of what the company owns (assets) and owes (liabilities) at a specific point in time.

**Key ratios to calculate:**

1. **Current Ratio** = Current Assets ÷ Current Liabilities. Above 1.5 is comfortable.
2. **Debt-to-Equity** = Total Debt ÷ Shareholders' Equity. Below 1.0 is conservative.
3. **Book Value per Share** = Shareholders' Equity ÷ Shares Outstanding.

> A company trading below book value isn't automatically cheap — it might be cheap for a reason. Always ask *why* the market is pricing it there.

## The Cash Flow Statement

This is arguably the most important statement and the most overlooked. Profits can be manipulated. Cash flow cannot.

Three sections:

- **Operating Cash Flow:** Cash generated from the core business. This should be positive and growing.
- **Investing Cash Flow:** Cash spent on capital expenditures, acquisitions. Usually negative — that's fine.
- **Financing Cash Flow:** Cash from raising debt, issuing shares, or paying dividends.

**The golden rule:** Operating cash flow should exceed net profit over time. If a company reports KES 5 billion in profit but only KES 2 billion in operating cash flow, something is wrong.

## Practical Exercise

Let's apply this framework. Pull up Equity Group's latest annual report from the NSE website:

1. Find the revenue trend over the last 3 years — is it growing?
2. Calculate the current ratio and debt-to-equity
3. Compare operating cash flow to net profit
4. Check the dividend payout ratio — is it sustainable?

If you can answer these four questions for any NSE company, you're already ahead of most investors in the market.

## Common Red Flags

- Consistent negative operating cash flow despite reported profits
- Receivables growing much faster than revenue (customers not paying)
- Frequent related-party transactions without clear business justification
- Auditor qualifications or changes in auditing firms
- Directors selling large stakes without explanation`,
  },
  {
    slug: "nseinsider-bot-v2-launch",
    title: "NSEinsider Bot v2: Real-Time Alerts, Watchlists, and More",
    description: "Our Telegram bot just got a major upgrade. Here's everything new in v2 — including real-time price alerts, custom watchlists, and daily market summaries.",
    date: "2026-03-01",
    author: "Kevin Njoroge",
    authorRole: "Product Lead",
    tags: ["bot", "telegram", "product-update", "alerts"],
    category: "bot-updates",
    coverImage: "",
    draft: false,
    content: `## What's New in v2

We've been listening to your feedback. The NSEinsider Telegram Bot v2 is our biggest update yet, designed to make following the NSE effortless. Here's what's new.

## Real-Time Price Alerts

Set custom price alerts for any NSE counter. Get notified the moment your target is hit.

**How to use:**

\`\`\`
/alert SCOM above 30.00
/alert KCB below 38.00
/alert EQTY range 48.00-55.00
\`\`\`

You can set up to 20 active alerts on the free tier and unlimited alerts on Pro.

## Custom Watchlists

Create and manage watchlists to track the counters you care about. Get a daily summary of your watchlist performance.

\`\`\`
/watchlist create "Banking Picks"
/watchlist add "Banking Picks" KCB EQTY COOP
/watchlist summary
\`\`\`

## Daily Market Summary

Every trading day at 4:30 PM EAT, the bot sends you a concise summary:

- NASI, NSE-20, and NSE-25 index performance
- Top 5 gainers and losers
- Total market turnover
- Notable corporate actions

You can customise the summary to include only your watchlist stocks.

## Improved Command Reference

- \`/price SCOM\` — Current price and daily change
- \`/chart KCB 30d\` — 30-day price chart
- \`/fundamentals EQTY\` — Key ratios (P/E, P/B, dividend yield)
- \`/news SCOM\` — Latest news mentions
- \`/compare KCB EQTY\` — Side-by-side comparison

## What's Coming in v2.1

- Portfolio tracking with profit/loss calculations
- Earnings calendar integration
- SMS alerts for users without reliable data
- API access for developers

> The bot is free to use for basic features. Pro access (KES 500/month) unlocks unlimited alerts, priority delivery, and advanced charts. Start by messaging @NSEInsider_bot on Telegram.

## Feedback

We ship based on what you tell us. Drop your feature requests and bug reports in our Telegram community or email us at hello@nseinsider.co.ke.`,
  },
];

export function getPublishedPosts(): BlogPost[] {
  return blogPosts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function sortPublishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getPostBySlugFrom(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: PostCategory): BlogPost[] {
  return getPublishedPosts().filter((p) => p.category === category);
}

export function getPostsByCategoryFrom(posts: BlogPost[], category: PostCategory): BlogPost[] {
  return sortPublishedPosts(posts).filter((p) => p.category === category);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getPublishedPosts().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getPublishedPosts().filter((p) => p.tags.includes(tag));
}

export function getAllTagsFrom(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  sortPublishedPosts(posts).forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getPostsByTagFrom(posts: BlogPost[], tag: string): BlogPost[] {
  return sortPublishedPosts(posts).filter((p) => p.tags.includes(tag));
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getPublishedPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => post.tags.includes(t)).length + (p.category === post.category ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

export function getRelatedPostsFrom(posts: BlogPost[], post: BlogPost, limit = 3): BlogPost[] {
  return sortPublishedPosts(posts)
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => post.tags.includes(t)).length + (p.category === post.category ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

// ─── Adjacent Posts (Prev / Next) ───────────────────────────────────────────
export function getAdjacentPosts(slug: string): {
  prev: BlogPost | null;
  next: BlogPost | null;
} {
  const posts = getPublishedPosts(); // sorted newest → oldest
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    next: idx > 0 ? posts[idx - 1] : null,          // newer post
    prev: idx < posts.length - 1 ? posts[idx + 1] : null, // older post
  };
}

export function getAdjacentPostsFrom(posts: BlogPost[], slug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const sorted = sortPublishedPosts(posts);
  const idx = sorted.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    next: idx > 0 ? sorted[idx - 1] : null,
    prev: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

// ─── Archive Helpers ─────────────────────────────────────────────────────────
export interface ArchiveMonth {
  year: number;
  month: number;
  label: string;
  count: number;
  href: string;
}

export function getArchiveMonths(): ArchiveMonth[] {
  const posts = getPublishedPosts();
  const map = new Map<string, { year: number; month: number; count: number }>();
  posts.forEach((p) => {
    const d = new Date(p.date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${month}`;
    const existing = map.get(key);
    if (existing) existing.count++;
    else map.set(key, { year, month, count: 1 });
  });
  return Array.from(map.values())
    .sort((a, b) => b.year - a.year || b.month - a.month)
    .map(({ year, month, count }) => ({
      year,
      month,
      count,
      label: new Date(year, month - 1).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      }),
      href: `/archive/${year}/${String(month).padStart(2, "0")}`,
    }));
}

export function getArchiveMonthsFrom(posts: BlogPost[]): ArchiveMonth[] {
  const published = sortPublishedPosts(posts);
  const map = new Map<string, { year: number; month: number; count: number }>();
  published.forEach((p) => {
    const d = new Date(p.date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${month}`;
    const existing = map.get(key);
    if (existing) existing.count++;
    else map.set(key, { year, month, count: 1 });
  });
  return Array.from(map.values())
    .sort((a, b) => b.year - a.year || b.month - a.month)
    .map(({ year, month, count }) => ({
      year,
      month,
      count,
      label: new Date(year, month - 1).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      }),
      href: `/archive/${year}/${String(month).padStart(2, "0")}`,
    }));
}

export function getPostsByYearMonth(year: number, month: number): BlogPost[] {
  return getPublishedPosts().filter((p) => {
    const d = new Date(p.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

export function getPostsByYearMonthFrom(posts: BlogPost[], year: number, month: number): BlogPost[] {
  return sortPublishedPosts(posts).filter((p) => {
    const d = new Date(p.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export const POSTS_PER_PAGE = 12;

export interface PaginatedResult {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

export function paginatePosts(
  posts: BlogPost[],
  page: number,
  perPage = POSTS_PER_PAGE
): PaginatedResult {
  const currentPage = Math.max(1, Math.min(page, Math.ceil(posts.length / perPage) || 1));
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const start = (currentPage - 1) * perPage;
  return {
    posts: posts.slice(start, start + perPage),
    totalPages,
    currentPage,
    totalPosts: posts.length,
  };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function generateRSSFeed(): string {
  const posts = getPublishedPosts();
  const items = posts.map(
    (p) => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>https://nseinsider.co.ke/blog/${p.slug}</link>
      <description><![CDATA[${p.description}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <author>${p.author}</author>
      <category>${p.category}</category>
      ${p.tags.map((t) => `<category>${t}</category>`).join("\n      ")}
    </item>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NSEinsider</title>
    <link>https://nseinsider.co.ke</link>
    <description>Kenya's market intelligence platform. Weekly analysis, company deep dives, and investor education for the Nairobi Securities Exchange.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://nseinsider.co.ke/rss.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;
}
