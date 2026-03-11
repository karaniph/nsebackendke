import { useEffect } from "react";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  keywords?: string[];
  section?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  schemaType?: "website" | "article" | "collection" | "page";
  faq?: Array<{ question: string; answer: string }>;
}

const SITE_NAME = "NSEinsider";
const SITE_URL = "https://nseinsider.co.ke";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const TWITTER_HANDLE = "@NSEinsider";

const SEOHead = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedDate,
  modifiedDate,
  author,
  keywords,
  section,
  noindex = false,
  breadcrumbs = [],
  schemaType,
  faq,
}: SEOHeadProps) => {
  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  const fullTitle = normalizedPath === "/" ? title : `${title} — ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;

  useEffect(() => {
    document.title = fullTitle;

    const upsertMeta = (name: string, content: string, kind: "name" | "property" = "name") => {
      const selector = kind === "property" ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(kind, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const upsertLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    const removeMeta = (name: string, kind: "name" | "property" = "name") => {
      const selector = kind === "property" ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      document.querySelector(selector)?.remove();
    };

    const ogImage = image ? (image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`) : DEFAULT_OG_IMAGE;
    const metaRobots = noindex ? "noindex, nofollow, noarchive" : "index, follow, max-image-preview:large, max-snippet:-1";

    upsertMeta("description", description);
    upsertMeta("robots", metaRobots);
    upsertMeta("googlebot", metaRobots);
    if (keywords && keywords.length > 0) {
      upsertMeta("keywords", keywords.join(", "));
    } else {
      removeMeta("keywords");
    }

    upsertMeta("og:title", fullTitle, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:url", canonicalUrl, "property");
    upsertMeta("og:type", type, "property");
    upsertMeta("og:site_name", SITE_NAME, "property");
    upsertMeta("og:locale", "en_KE", "property");
    upsertMeta("og:image", ogImage, "property");
    upsertMeta("og:image:alt", `${SITE_NAME} - ${fullTitle}`, "property");

    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:site", TWITTER_HANDLE);
    upsertMeta("twitter:creator", TWITTER_HANDLE);
    upsertMeta("twitter:title", fullTitle);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", ogImage);
    upsertMeta("twitter:image:alt", `${SITE_NAME} - ${fullTitle}`);

    if (publishedDate) {
      upsertMeta("article:published_time", publishedDate, "property");
    } else {
      removeMeta("article:published_time", "property");
    }
    if (modifiedDate) {
      upsertMeta("article:modified_time", modifiedDate, "property");
    } else {
      removeMeta("article:modified_time", "property");
    }
    if (author) {
      upsertMeta("article:author", author, "property");
    } else {
      removeMeta("article:author", "property");
    }
    if (section) {
      upsertMeta("article:section", section, "property");
    } else {
      removeMeta("article:section", "property");
    }

    upsertLink("canonical", canonicalUrl);

    const activeSchemaType = schemaType || (type === "article" ? "article" : "website");
    const baseSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": activeSchemaType === "article" ? "Article" : activeSchemaType === "collection" ? "CollectionPage" : activeSchemaType === "website" ? "WebSite" : "WebPage",
      name: fullTitle,
      headline: fullTitle,
      description,
      url: canonicalUrl,
      inLanguage: "en-KE",
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL
      }
    };

    if (activeSchemaType === "article") {
      baseSchema.author = {
        "@type": "Person",
        name: author || "NSEinsider Desk"
      };
      baseSchema.publisher = {
        "@type": "Organization",
        name: SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: DEFAULT_OG_IMAGE
        }
      };
      baseSchema.datePublished = publishedDate || undefined;
      baseSchema.dateModified = modifiedDate || publishedDate || undefined;
      baseSchema.image = [ogImage];
      if (keywords && keywords.length > 0) {
        baseSchema.keywords = keywords.join(", ");
      }
      if (section) {
        baseSchema.articleSection = section;
      }
    }

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: DEFAULT_OG_IMAGE,
      sameAs: ["https://t.me/NSEInsider_bot"]
    };

    const breadcrumbSchema =
      breadcrumbs.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`
            }))
          }
        : null;

    const faqSchema =
      faq && faq.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer
              }
            }))
          }
        : null;

    const graph = [organizationSchema, baseSchema, breadcrumbSchema, faqSchema].filter(Boolean);
    let schemaScript = document.querySelector('script[data-seo-schema="true"]');
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.setAttribute("type", "application/ld+json");
      schemaScript.setAttribute("data-seo-schema", "true");
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(graph);
  }, [
    fullTitle,
    description,
    canonicalUrl,
    type,
    image,
    publishedDate,
    modifiedDate,
    author,
    keywords,
    section,
    noindex,
    schemaType,
    breadcrumbs,
    faq
  ]);

  return null;
};

export default SEOHead;
