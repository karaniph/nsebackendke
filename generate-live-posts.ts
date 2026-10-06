import fs from "node:fs";
import path from "node:path";
import { getPublishedPosts, type BlogPost, type PostCategory } from "./src/lib/blog-data";
import { sanitizeRemoteBlogContent } from "./src/lib/blog-content";
import { getLocalContentPosts } from "./src/lib/local-content-posts";

const PUBLIC_FEED_URL =
  process.env.BLOG_FEED_API || "https://nse-bot-backend.karanidevops.workers.dev/public/blog/posts?limit=200&include_failed=1";
const ADMIN_FEED_BASE =
  process.env.BLOG_DRAFTS_API || "https://nse-bot-backend.karanidevops.workers.dev/admin/blog/drafts?limit=200";
const ADMIN_TOKEN = (process.env.BLOG_ADMIN_TOKEN || "").trim();
const INCLUDE_DRAFTS = /^(1|true|yes)$/i.test((process.env.BLOG_FEED_INCLUDE_DRAFTS || "").trim());

interface PublicFeedItem {
  report_date: string;
  category: "news" | "market-briefs" | "deep-dives" | "education";
  title: string;
  slug: string;
  excerpt: string | null;
  content_markdown: string;
  updated_at?: string | null;
}

interface PublicFeedResponse {
  ok: boolean;
  items?: PublicFeedItem[];
}

interface AdminDraftItem {
  report_date: string;
  category: "news" | "market-briefs" | "deep-dives" | "education";
  title: string;
  slug: string;
  excerpt: string | null;
  content_markdown: string;
  updated_at?: string | null;
  publish_status?: string | null;
}

interface AdminDraftResponse {
  ok: boolean;
  drafts?: AdminDraftItem[];
}

function normalizeCategory(category: string): PostCategory {
  if (category === "news") return "news";
  if (category === "deep-dives") return "deep-dives";
  if (category === "education") return "education";
  return "market-briefs";
}

function guessTags(title: string, excerpt: string | null, category: string): string[] {
  const tags = new Set<string>(["nse", "kenya"]);
  tags.add(
    category === "news"
      ? "news"
      : category === "market-briefs"
        ? "market-brief"
        : category === "deep-dives"
          ? "deep-dive"
          : "education"
  );

  const hay = `${title} ${excerpt || ""}`.toLowerCase();
  const checks: Array<[string, string]> = [
    ["safaricom", "safaricom"],
    ["kcb", "kcb"],
    ["equity", "equity"],
    ["dividend", "dividend"],
    ["cbk", "cbk"],
    ["bond", "bonds"],
    ["t-bill", "t-bills"],
    ["foreign", "foreign-flow"]
  ];
  for (const [needle, tag] of checks) {
    if (hay.includes(needle)) tags.add(tag);
  }
  return Array.from(tags);
}

function toBlogPost(item: PublicFeedItem | AdminDraftItem): BlogPost {
  const category = normalizeCategory(item.category);
  return {
    slug: item.slug,
    title: item.title,
    description: item.excerpt || "NSEinsider market update.",
    date: item.report_date,
    updatedAt: item.updated_at || item.report_date,
    author: "NSEinsider Desk",
    authorRole: category === "news" ? "Newsroom" : category === "education" ? "Education Desk" : "Market Intelligence Desk",
    tags: guessTags(item.title, item.excerpt, item.category),
    category,
    coverImage: "",
    draft: false,
    content: sanitizeRemoteBlogContent(item.content_markdown)
  };
}

function mergePosts(remote: BlogPost[], local: BlogPost[]): BlogPost[] {
  const map = new Map<string, BlogPost>();
  for (const post of local) {
    if (!post.draft) map.set(post.slug, post);
  }
  for (const post of remote) {
    map.set(post.slug, post);
  }
  return Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function fetchPublicPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(PUBLIC_FEED_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) return [];
    const payload = (await response.json()) as PublicFeedResponse;
    return (payload.items || []).map(toBlogPost);
  } catch (_error) {
    return [];
  }
}

async function fetchDraftPosts(): Promise<BlogPost[]> {
  if (!INCLUDE_DRAFTS || !ADMIN_TOKEN) return [];
  const url = `${ADMIN_FEED_BASE}${ADMIN_FEED_BASE.includes("?") ? "&" : "?"}admin_token=${encodeURIComponent(ADMIN_TOKEN)}`;
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) return [];
    const payload = (await response.json()) as AdminDraftResponse;
    const drafts = (payload.drafts || []).filter((item) => (item.publish_status || "draft") !== "published");
    return drafts.map(toBlogPost);
  } catch (_error) {
    return [];
  }
}

async function main() {
  const [publicPosts, draftPosts] = await Promise.all([fetchPublicPosts(), fetchDraftPosts()]);
  const localPosts = mergePosts(getLocalContentPosts(), getPublishedPosts());
  const merged = mergePosts([...publicPosts, ...draftPosts], localPosts).slice(0, 250);
  const dest = path.resolve(process.cwd(), "public", "live-posts.json");
  fs.writeFileSync(dest, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(
    `Generated live post feed at ${dest} (${merged.length} posts, drafts ${draftPosts.length}, public ${publicPosts.length}, local ${localPosts.length})`
  );
}

main();
