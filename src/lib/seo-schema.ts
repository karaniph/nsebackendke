// src/lib/seo-schema.ts
// Central JSON-LD builders. Everything is emitted as a single `@graph` so
// Article / BreadcrumbList / FAQPage can reference the Organization and WebSite
// nodes by @id instead of repeating them.
export const SITE_URL = "https://nseinsider.co.ke";
export const SITE_NAME = "NSEinsider";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const LOGO_URL = `${SITE_URL}/favicon.png`;

/**
 * Resolves a site-relative path to an absolute URL, adding the trailing slash
 * Astro's directory build format uses so schema URLs match the page canonicals.
 */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  const cut = path.search(/[?#]/);
  const base = cut === -1 ? path : path.slice(0, cut);
  const suffix = cut === -1 ? "" : path.slice(cut);
  const needsSlash = !base.endsWith("/") && !/\.[a-z0-9]+$/i.test(base);
  return `${SITE_URL}${needsSlash ? `${base}/` : base}${suffix}`;
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    email: "hello@nseinsider.co.ke",
    description:
      "Independent market intelligence for the Nairobi Securities Exchange: daily market briefs, company deep dives, and investor education for Kenya.",
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 640,
      height: 640,
      caption: SITE_NAME,
    },
    image: { "@id": `${SITE_URL}/#logo` },
    areaServed: { "@type": "Country", name: "Kenya" },
    sameAs: ["https://t.me/nseinsiderske"],
  };
}

// Note: no SearchAction is emitted. Google retired the sitelinks searchbox in
// 2023, and this site's search is a client-side overlay with no ?q= URL to
// point at, so declaring one would describe an endpoint that does not exist.
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: "NSE insider",
    description:
      "Daily NSE market briefs, company deep dives, and practical investor education for Kenya.",
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-KE",
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path or absolute URL. Omit on the current page. */
  url?: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[], pageUrl: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqSchema(entries: FaqEntry[], pageUrl: string) {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export interface ArticleSchemaInput {
  pageUrl: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorRole?: string;
  section?: string;
  keywords?: string[];
  wordCount?: number;
  hasBreadcrumb?: boolean;
}

export function articleSchema(input: ArticleSchemaInput) {
  return {
    "@type": "Article",
    "@id": `${input.pageUrl}#article`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.pageUrl },
    url: input.pageUrl,
    headline: input.headline,
    description: input.description,
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(input.image),
      width: 1200,
      height: 630,
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": "Person",
      name: input.authorName,
      ...(input.authorRole ? { jobTitle: input.authorRole } : {}),
      worksFor: { "@id": ORGANIZATION_ID },
    },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-KE",
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords.join(", ") } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    ...(input.hasBreadcrumb ? { breadcrumb: { "@id": `${input.pageUrl}#breadcrumb` } } : {}),
  };
}

/** Wraps nodes in the JSON-LD envelope emitted by BaseLayout. */
export function buildGraph(nodes: Array<Record<string, unknown> | null | undefined>) {
  const graph = nodes.filter(Boolean);
  if (graph.length === 0) return null;
  return { "@context": "https://schema.org", "@graph": graph };
}
