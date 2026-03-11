import fs from "node:fs";
import path from "node:path";
import { getPublishedPosts, type BlogPost } from "./src/lib/blog-data";

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

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRss(posts: BlogPost[]): string {
  const items = posts
    .map(
      (p) => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${xmlEscape(`${SITE_URL}/blog/${p.slug}`)}</link>
      <guid>${xmlEscape(`${SITE_URL}/blog/${p.slug}`)}</guid>
      <description><![CDATA[${p.description}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <author>${xmlEscape(p.author)}</author>
      <category>${xmlEscape(p.category)}</category>
      ${p.tags.map((t) => `<category>${xmlEscape(t)}</category>`).join("\n      ")}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NSEinsider</title>
    <link>${SITE_URL}</link>
    <description>Kenya market briefs, deep dives, and investor education from NSEinsider.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

async function main() {
  const local = getPublishedPosts();
  const remote = await fetchRemotePosts();
  const merged = mergePosts(remote, local).slice(0, 200);
  const xml = generateRss(merged);
  const dest = path.resolve(process.cwd(), "public", "rss.xml");
  fs.writeFileSync(dest, xml);
  console.log(`✅ Generated RSS feed at ${dest} (${merged.length} posts)`);
}

main();
