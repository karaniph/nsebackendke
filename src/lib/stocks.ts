// src/lib/stocks.ts
// Registry of NSE counters the corpus covers, plus the matcher that powers the
// /stocks/<ticker> hub pages. These hubs aggregate existing coverage of a
// company into one page that can rank for entity queries ("safaricom nse",
// "kcb dividend", "eabl share analysis") — demand the site had no landing page
// for, since coverage was scattered across dated briefs and deep dives.
import type { BlogPost, BlogPostSummary } from "./blog-data";

export interface StockDefinition {
  ticker: string;
  name: string;
  /** Lower-cased strings that identify the company in a title or body. */
  aliases: string[];
  /** Existing tag slug for this company, if any. */
  tag?: string;
  /** One-line description of the business for the hub intro and meta. */
  blurb: string;
}

export const STOCK_REGISTRY: StockDefinition[] = [
  {
    ticker: "SCOM",
    name: "Safaricom",
    aliases: ["safaricom", "m-pesa", "mpesa"],
    tag: "safaricom",
    blurb: "Kenya's largest telco and the operator of M-Pesa, and the most heavily traded counter on the NSE.",
  },
  {
    ticker: "KCB",
    name: "KCB Group",
    aliases: ["kcb group", "kcb"],
    tag: "kcb",
    blurb: "One of Kenya's largest banking groups by assets, with a growing regional footprint.",
  },
  {
    ticker: "EQTY",
    name: "Equity Group",
    aliases: ["equity group", "equity bank", "equity holdings"],
    tag: "equity",
    blurb: "A pan-African financial services group and one of the NSE's most widely held bank stocks.",
  },
  {
    ticker: "COOP",
    name: "Co-operative Bank",
    aliases: ["co-operative bank", "cooperative bank", "co-op bank", "coop"],
    blurb: "A leading Kenyan retail bank known for its co-operative ownership roots and dividend record.",
  },
  {
    ticker: "EABL",
    name: "East African Breweries",
    aliases: ["east african breweries", "eabl"],
    blurb: "The region's dominant beverages company and a long-standing NSE blue chip.",
  },
  {
    ticker: "BATK",
    name: "BAT Kenya",
    aliases: ["bat kenya", "british american tobacco"],
    blurb: "A consistent dividend payer on the NSE and Kenya's listed tobacco manufacturer.",
  },
];

export interface StockMatch {
  post: BlogPostSummary;
  /** Higher = more clearly about this company (title/ticker/tag vs a passing mention). */
  strength: number;
}

/**
 * Scores how strongly a post is about a company:
 *   3  ticker in parentheses in the title, e.g. "KCB Group (KCB)"
 *   2  company name in the title, or a matching tag
 *   1  company name mentioned in the body
 *   0  no match
 */
export function stockMatchStrength(post: BlogPost | BlogPostSummary, stock: StockDefinition): number {
  const title = post.title.toLowerCase();
  if (new RegExp(`\\(${stock.ticker.toLowerCase()}\\)`).test(title)) return 3;
  if (stock.aliases.some((alias) => title.includes(alias))) return 2;
  if (stock.tag && (post.tags || []).includes(stock.tag)) return 2;
  const body = "content" in post && post.content ? post.content.toLowerCase() : "";
  if (body && stock.aliases.some((alias) => body.includes(alias))) return 1;
  return 0;
}

/** Posts about a company, strongest and newest first. */
export function getStockPosts(posts: BlogPost[], stock: StockDefinition): StockMatch[] {
  return posts
    .map((post) => ({ post, strength: stockMatchStrength(post, stock) }))
    .filter((m) => m.strength > 0)
    .sort((a, b) => b.strength - a.strength || +new Date(b.post.date) - +new Date(a.post.date))
    .map(({ post, strength }) => {
      const { content, blocks, ...summary } = post as BlogPost;
      return { post: summary, strength };
    });
}

/** Minimum coverage before a hub is worth publishing (avoids thin pages). */
export const MIN_HUB_POSTS = 3;
