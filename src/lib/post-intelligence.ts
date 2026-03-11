import type { BlogPost } from "@/lib/blog-data";

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
    post.category === "market-briefs"
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

export function getCategoryOgImage(category: string): string {
  if (category === "education") return "/og-education.svg";
  if (category === "deep-dives") return "/og-deep-dives.svg";
  if (category === "market-briefs") return "/og-market-briefs.svg";
  return "/og-image.jpg";
}
