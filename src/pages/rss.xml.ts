// src/pages/rss.xml.ts
// The feed is built here at build time. It previously called
// `generateRSSFeed()`, which only knows the four hardcoded posts in blog-data,
// and the prerendered route overwrote the 134-item feed produced by the prebuild
// script — so the published feed shipped four items.
import type { APIRoute } from "astro";
import { fetchLivePosts } from "../lib/live-blog";
import { sortPublishedPosts } from "../lib/blog-data";

const SITE_URL = "https://nseinsider.co.ke";
const FEED_LIMIT = 50;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]&gt;")}]]>`;
}

export const GET: APIRoute = async () => {
  const posts = sortPublishedPosts((await fetchLivePosts()) || []).slice(0, FEED_LIMIT);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}/`;
      return `    <item>
      <title>${cdata(post.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <description>${cdata(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator>${cdata(post.author)}</dc:creator>
      <category>${xmlEscape(post.category)}</category>
${(post.tags || []).map((tag) => `      <category>${xmlEscape(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const lastBuildDate = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>NSEinsider</title>
    <link>${SITE_URL}/</link>
    <description>Daily NSE market briefs, company deep dives, and practical investor education for Kenya.</description>
    <language>en-KE</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
