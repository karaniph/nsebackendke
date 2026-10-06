// src/pages/og/site/[key].png.ts
// Prerenders the non-post Open Graph images (site default + one per category).
import type { APIRoute } from "astro";
import { CATEGORY_ACCENT, DEFAULT_ACCENT, ogImageResponse, renderOgImage } from "../../../lib/og-image";

interface SiteOgEntry {
  key: string;
  title: string;
  kicker: string;
  accent: string;
}

const SITE_OG_IMAGES: SiteOgEntry[] = [
  {
    key: "default",
    title: "Kenya's market intelligence platform for the Nairobi Securities Exchange",
    kicker: "NSEinsider",
    accent: DEFAULT_ACCENT,
  },
  {
    key: "news",
    title: "Latest Kenya, NSE, and East African business news for investors",
    kicker: "News",
    accent: CATEGORY_ACCENT["news"],
  },
  {
    key: "market-briefs",
    title: "Daily NSE market briefs: index direction, key movers, and what to watch",
    kicker: "Market Briefs",
    accent: CATEGORY_ACCENT["market-briefs"],
  },
  {
    key: "deep-dives",
    title: "NSE company deep dives: valuation, financial trend, and key risks",
    kicker: "Deep Dives",
    accent: CATEGORY_ACCENT["deep-dives"],
  },
  {
    key: "education",
    title: "Practical investor education for the Nairobi Securities Exchange",
    kicker: "Education",
    accent: CATEGORY_ACCENT["education"],
  },
  {
    key: "bot-updates",
    title: "NSEinsider Telegram bot: alerts, watchlists, and daily summaries",
    kicker: "Bot Updates",
    accent: CATEGORY_ACCENT["bot-updates"],
  },
];

export async function getStaticPaths() {
  return SITE_OG_IMAGES.map(({ key, ...props }) => ({
    params: { key },
    props,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, kicker, accent } = props as unknown as Omit<SiteOgEntry, "key">;
  return ogImageResponse(await renderOgImage({ title, kicker, accent }));
};
