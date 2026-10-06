import type { BlogPost, BlogPostCard } from "@/lib/blog-data";

export interface PostHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || "section";
}

/**
 * Normalises post markdown before rendering.
 *
 * Two problems in the corpus this fixes:
 *  1. 57 posts open with a level-1 heading that repeats the post title, and the
 *     template already renders the title as the page's <h1>. That produced up to
 *     six <h1> elements per page.
 *  2. Any other level-1 heading is demoted to level 2 so the document outline is
 *     title -> sections, and so those sections become eligible for the on-page
 *     table of contents (which only ever looked at ## and ###).
 *
 * Fenced code blocks are left untouched so `# comment` lines survive.
 */
export function normalizePostMarkdown(markdown: string, title?: string): string {
  if (!markdown) return "";

  const normalizedTitle = (title || "").replace(/\s+/g, " ").trim().toLowerCase();
  const out: string[] = [];
  let insideFence = false;
  let titleRemoved = false;

  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();

    if (/^(```|~~~)/.test(trimmed)) {
      insideFence = !insideFence;
      out.push(line);
      continue;
    }
    if (insideFence) {
      out.push(line);
      continue;
    }

    const heading = /^#\s+(.*\S)\s*$/.exec(trimmed);
    if (!heading) {
      out.push(line);
      continue;
    }

    const text = heading[1].replace(/\s+/g, " ").trim();
    if (!titleRemoved && normalizedTitle && text.toLowerCase() === normalizedTitle) {
      titleRemoved = true;
      continue;
    }
    out.push(`## ${text}`);
  }

  return out.join("\n").replace(/^\n+/, "");
}

export function extractHeadings(markdown: string): PostHeading[] {
  const seen = new Map<string, number>();
  const headings: PostHeading[] = [];
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    let text = "";
    let level: 2 | 3 | null = null;
    if (trimmed.startsWith("## ")) {
      text = trimmed.slice(3).trim();
      level = 2;
    } else if (trimmed.startsWith("### ")) {
      text = trimmed.slice(4).trim();
      level = 3;
    }
    if (!level || !text) continue;
    const base = slugifyHeading(text);
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    headings.push({ id, text, level });
  }
  return headings;
}

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown
    .replace(/[`*_>#-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function extractSourceUrls(markdown: string): string[] {
  const urls = new Set<string>();
  const linkRegex = /\[[^\]]+\]\((https?:\/\/[^)]+)\)/g;
  const plainRegex = /(https?:\/\/[^\s)]+)/g;
  for (const match of markdown.matchAll(linkRegex)) {
    urls.add(match[1].replace(/[.,;]+$/, ""));
  }
  for (const match of markdown.matchAll(plainRegex)) {
    urls.add(match[1].replace(/[.,;]+$/, ""));
  }
  return Array.from(urls);
}

export function inferMarketMood(markdown: string): "Bullish" | "Bearish" | "Mixed" {
  const text = markdown.toLowerCase();
  const positive = ["gain", "rally", "up", "strong", "surge", "improved"];
  const negative = ["drop", "down", "selloff", "outflow", "weak", "decline", "risk"];
  let pos = 0;
  let neg = 0;
  for (const token of positive) if (text.includes(token)) pos += 1;
  for (const token of negative) if (text.includes(token)) neg += 1;
  if (pos - neg >= 2) return "Bullish";
  if (neg - pos >= 2) return "Bearish";
  return "Mixed";
}

export function extractKeyTakeaways(markdown: string, limit = 3): string[] {
  const clean = (value: string): string =>
    value
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`>#]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const bullets = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => clean(line.slice(2).trim()))
    .filter(Boolean);
  if (bullets.length >= limit) return bullets.slice(0, limit);

  const sentences = markdown
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => clean(s.trim()))
    .filter((s) => s.length > 50 && !s.startsWith("#"));
  return sentences.slice(0, limit);
}

export function getPostMetaDescription(post: BlogPost): string {
  const categoryPrefix =
    post.category === "news"
      ? "NSE & Kenya Business News"
      : post.category === "market-briefs"
        ? "NSE Market Brief"
        : post.category === "deep-dives"
          ? "NSE Company Deep Dive"
          : post.category === "education"
            ? "NSE Investor Education"
            : "NSEinsider Update";
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  return `${categoryPrefix} (${date}): ${post.description}`.slice(0, 160);
}

const SITE_OG_KEYS = new Set(["news", "market-briefs", "deep-dives", "education", "bot-updates"]);

/**
 * Category-level Open Graph image. These are real PNGs prerendered by
 * `src/pages/og/site/[key].png.ts` — the previous SVG references were never
 * rendered by social crawlers, and `bot-updates` pointed at an og-image.jpg
 * that did not exist.
 */
export function getCategoryOgImage(category: string): string {
  return SITE_OG_KEYS.has(category) ? `/og/site/${category}.png` : "/og/site/default.png";
}

/** Per-post Open Graph image, prerendered by `src/pages/og/[slug].png.ts`. */
export function getPostOgImage(slug: string): string {
  return `/og/${slug}.png`;
}

/**
 * Converts a post to the shape a card needs, dropping `content` and `blocks`.
 *
 * Post pages used to hand the entire post corpus to the React island, which
 * serialised ~673 KB of duplicate markdown into every page's HTML. Reading time
 * and source count are derived here so cards stay accurate without the body.
 *
 * Lives in a module rather than page frontmatter because Astro hoists
 * `getStaticPaths` into a scope where only imports are in scope.
 */
export function toPostCard(post: BlogPost): BlogPostCard {
  const { content, blocks, ...summary } = post;
  return {
    ...summary,
    readMinutes: estimateReadingMinutes(content || ""),
    sourceCount: extractSourceUrls(content || "").length,
  };
}
