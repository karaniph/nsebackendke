// src/pages/og/[slug].png.ts
// Prerenders one 1200x630 PNG per post at /og/<slug>.png.
// Paths come from the same source as the post pages, so coverage stays 1:1.
import type { APIRoute } from "astro";
import { fetchLivePosts } from "../../lib/live-blog";
import { sortPublishedPosts, formatDate, CATEGORY_LABELS, type BlogPost } from "../../lib/blog-data";
import { CATEGORY_ACCENT, DEFAULT_ACCENT, ogImageResponse, renderOgImage } from "../../lib/og-image";

interface OgProps {
  title: string;
  kicker: string;
  accent: string;
}

export async function getStaticPaths() {
  const published = sortPublishedPosts((await fetchLivePosts()) || []);

  return published.map((post: BlogPost) => ({
    params: { slug: post.slug },
    props: {
      title: post.title,
      kicker: `${CATEGORY_LABELS[post.category] ?? "Analysis"} · ${formatDate(post.date)}`,
      accent: CATEGORY_ACCENT[post.category] ?? DEFAULT_ACCENT,
    } satisfies OgProps,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, kicker, accent } = props as unknown as OgProps;
  return ogImageResponse(await renderOgImage({ title, kicker, accent }));
};
