import { blogPosts, type BlogPost, type PostCategory } from "@/lib/blog-data";
import { sanitizeRemoteBlogContent } from "@/lib/blog-content";

interface PublicFeedItem {
  id: number;
  report_date: string;
  category: "news" | "market-briefs" | "deep-dives" | "education";
  title: string;
  slug: string;
  excerpt: string | null;
  content_markdown: string;
  updated_at?: string | null;
  publish_status?: string | null;
}

interface PublicFeedResponse {
  ok: boolean;
  items?: PublicFeedItem[];
}

function normalizeCategory(category: string): PostCategory {
  if (category === "news") return "news";
  if (category === "deep-dives") return "deep-dives";
  if (category === "education") return "education";
  return "market-briefs";
}

function guessTags(item: PublicFeedItem): string[] {
  const tags = new Set<string>(["nse", "kenya"]);
  tags.add(
    item.category === "news"
      ? "news"
      : item.category === "market-briefs"
        ? "market-brief"
        : item.category === "deep-dives"
          ? "deep-dive"
          : "education"
  );

  const hay = `${item.title} ${item.excerpt || ""}`.toLowerCase();
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

function toBlogPost(item: PublicFeedItem): BlogPost {
  const category = normalizeCategory(item.category);
  return {
    slug: item.slug,
    title: item.title,
    description: item.excerpt || "NSEinsider market update.",
    date: item.report_date,
    updatedAt: item.updated_at || item.report_date,
    author: "NSEinsider Desk",
    authorRole: category === "news" ? "Newsroom" : category === "education" ? "Education Desk" : "Market Intelligence Desk",
    tags: guessTags(item),
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

async function fetchGeneratedPosts(): Promise<BlogPost[] | null> {
  try {
    if (import.meta.env.SSR) {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const source = path.resolve(process.cwd(), "public", "live-posts.json");
      const raw = await fs.readFile(source, "utf8");
      const payload = JSON.parse(raw) as BlogPost[];
      return Array.isArray(payload) ? payload : null;
    }

    const response = await fetch("/live-posts.json", {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as BlogPost[];
    return Array.isArray(payload) ? payload : null;
  } catch (_error) {
    return null;
  }
}

export async function fetchLivePosts(): Promise<BlogPost[]> {
  const generated = await fetchGeneratedPosts();
  if (generated && generated.length > 0) {
    return mergePosts(generated, blogPosts);
  }

  const apiBase = (import.meta.env.VITE_BLOG_FEED_API as string | undefined)?.trim()
    || "https://nse-bot-backend.karanidevops.workers.dev/public/blog/posts";

  try {
    const response = await fetch(`${apiBase}?limit=120&include_failed=1`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      return mergePosts([], blogPosts);
    }

    const payload = (await response.json()) as PublicFeedResponse;
    const items = Array.isArray(payload.items) ? payload.items : [];
    const remote = items
      .filter((item) => (item.publish_status || "published") !== "unpublished")
      .map(toBlogPost);
    return mergePosts(remote, blogPosts);
  } catch (_error) {
    return mergePosts([], blogPosts);
  }
}
