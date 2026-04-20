import fs from "node:fs";
import path from "node:path";
import { getPublishedPosts, type BlogPost } from "./src/lib/blog-data";
import { getLocalContentPosts } from "./src/lib/local-content-posts";

const SITE_URL = "https://nseinsider.co.ke";
const REMOTE_FEED =
  process.env.BLOG_FEED_API || "https://nse-bot-backend.karanidevops.workers.dev/public/blog/posts?limit=200&include_failed=1";

interface RemoteFeedItem {
  report_date: string;
  category: "market-briefs" | "deep-dives" | "education";
  title: string;
  slug: string;
  excerpt: string | null;
  content_markdown: string;
}

interface RemoteFeedResponse {
  ok: boolean;
  items?: RemoteFeedItem[];
}

function toRemotePost(item: RemoteFeedItem): BlogPost {
  return {
    slug: item.slug,
    title: item.title,
    description: item.excerpt || "NSEinsider market update.",
    date: item.report_date,
    author: "NSEinsider Desk",
    authorRole: item.category === "education" ? "Education Desk" : "Market Intelligence Desk",
    tags: ["nse", "kenya", item.category],
    category: item.category,
    coverImage: "",
    draft: false,
    content: item.content_markdown
  };
}

async function fetchRemotePosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(REMOTE_FEED, { headers: { Accept: "application/json" } });
    if (!response.ok) return [];
    const payload = (await response.json()) as RemoteFeedResponse;
    const items = Array.isArray(payload.items) ? payload.items : [];
    return items.map(toRemotePost);
  } catch (_error) {
    return [];
  }
}

function mergePosts(remote: BlogPost[], local: BlogPost[]): BlogPost[] {
  const map = new Map<string, BlogPost>();
  for (const post of local) {
    if (!post.draft) map.set(post.slug, post);
  }
  for (const post of remote) {
    map.set(post.slug, post);
  }
  return Array.from(map.values()).sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

function loadGeneratedPosts(): BlogPost[] {
  const source = path.resolve(process.cwd(), "public", "live-posts.json");
  try {
    const raw = fs.readFileSync(source, "utf8");
    const parsed = JSON.parse(raw) as BlogPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDay(dateText: string): string {
  const d = new Date(dateText);
  if (!Number.isFinite(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function buildSitemap(posts: BlogPost[]): string {
  const staticRoutes: Array<{ path: string; priority: string; changefreq: string; lastmod?: string }> = [
    { path: "/", priority: "1.0", changefreq: "hourly" },
    { path: "/about", priority: "0.6", changefreq: "monthly" },
    { path: "/contact", priority: "0.5", changefreq: "monthly" },
    { path: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
    { path: "/terms-and-conditions", priority: "0.5", changefreq: "yearly" },
    { path: "/tags", priority: "0.7", changefreq: "daily" },
    { path: "/category/market-briefs", priority: "0.9", changefreq: "hourly" },
    { path: "/category/deep-dives", priority: "0.8", changefreq: "daily" },
    { path: "/category/education", priority: "0.8", changefreq: "weekly" },
    { path: "/rss", priority: "0.3", changefreq: "weekly" }
  ];

  const urls = [
    ...staticRoutes.map((r) => {
      const lastmod = r.lastmod || new Date().toISOString();
      return `  <url>
    <loc>${xmlEscape(`${SITE_URL}${r.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
    }),
    ...posts.map((p) => {
      return `  <url>
    <loc>${xmlEscape(`${SITE_URL}/blog/${p.slug}`)}</loc>
    <lastmod>${toIsoDay(p.date)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    })
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

async function main() {
  const local = mergePosts(getLocalContentPosts(), getPublishedPosts());
  const generated = loadGeneratedPosts();
  const remote = generated.length > 0 ? generated : await fetchRemotePosts();
  const merged = mergePosts(remote, local).slice(0, 200);
  const xml = buildSitemap(merged);
  const dest = path.resolve(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(dest, xml);
  console.log(`✅ Generated sitemap at ${dest} (${merged.length} post URLs + static routes)`);
}

main();
