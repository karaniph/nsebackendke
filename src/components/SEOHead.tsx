import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedDate?: string;
  author?: string;
}

const SITE_NAME = "NSEinsider";
const SITE_URL = "https://nseinsider.co.ke";

const SEOHead = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedDate,
  author,
}: SEOHeadProps) => {
  const fullTitle = path === "/" ? title : `${title} — ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name.startsWith("og:") || name.startsWith("article:")) {
          el.setAttribute("property", name);
        } else {
          el.setAttribute("name", name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:url", url);
    setMeta("og:type", type);
    setMeta("og:site_name", SITE_NAME);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);

    if (image) {
      setMeta("og:image", image);
      setMeta("twitter:image", image);
    }
    if (publishedDate) {
      setMeta("article:published_time", publishedDate);
    }
    if (author) {
      setMeta("article:author", author);
    }
  }, [fullTitle, description, url, type, image, publishedDate, author]);

  return null;
};

export default SEOHead;
