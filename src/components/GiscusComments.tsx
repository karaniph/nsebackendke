import { useEffect, useRef } from "react";

interface GiscusCommentsProps {
  pathname: string;
}

const giscusConfig = {
  repo: import.meta.env.PUBLIC_GISCUS_REPO?.trim() || "",
  repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID?.trim() || "",
  category: import.meta.env.PUBLIC_GISCUS_CATEGORY?.trim() || "Announcements",
  categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID?.trim() || "",
  mapping: import.meta.env.PUBLIC_GISCUS_MAPPING?.trim() || "pathname",
  strict: import.meta.env.PUBLIC_GISCUS_STRICT?.trim() || "0",
  reactionsEnabled: import.meta.env.PUBLIC_GISCUS_REACTIONS_ENABLED?.trim() || "1",
  emitMetadata: import.meta.env.PUBLIC_GISCUS_EMIT_METADATA?.trim() || "0",
  inputPosition: import.meta.env.PUBLIC_GISCUS_INPUT_POSITION?.trim() || "top",
  lang: import.meta.env.PUBLIC_GISCUS_LANG?.trim() || "en",
  loading: import.meta.env.PUBLIC_GISCUS_LOADING?.trim() || "lazy",
};

const isConfigured = Boolean(
  giscusConfig.repo &&
    giscusConfig.repoId &&
    giscusConfig.category &&
    giscusConfig.categoryId
);

function getTheme(): string {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function sendThemeUpdate(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme,
        },
      },
    },
    "https://giscus.app"
  );
}

const GiscusComments = ({ pathname }: GiscusCommentsProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isConfigured || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", giscusConfig.repo);
    script.setAttribute("data-repo-id", giscusConfig.repoId);
    script.setAttribute("data-category", giscusConfig.category);
    script.setAttribute("data-category-id", giscusConfig.categoryId);
    script.setAttribute("data-mapping", giscusConfig.mapping);
    script.setAttribute("data-term", pathname);
    script.setAttribute("data-strict", giscusConfig.strict);
    script.setAttribute("data-reactions-enabled", giscusConfig.reactionsEnabled);
    script.setAttribute("data-emit-metadata", giscusConfig.emitMetadata);
    script.setAttribute("data-input-position", giscusConfig.inputPosition);
    script.setAttribute("data-theme", getTheme());
    script.setAttribute("data-lang", giscusConfig.lang);
    script.setAttribute("data-loading", giscusConfig.loading);

    container.appendChild(script);

    const observer = new MutationObserver(() => {
      sendThemeUpdate(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      container.innerHTML = "";
    };
  }, [pathname]);

  if (!isConfigured) {
    if (!import.meta.env.DEV) return null;

    return (
      <section className="mt-16 content-card p-6 md:p-7">
        <h2 className="text-xl font-heading font-bold text-foreground">Comments</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Giscus is not configured yet. Set the required <code>PUBLIC_GISCUS_*</code> environment
          variables to enable comments on article pages.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16 content-card p-6 md:p-7">
      <div className="mb-5">
        <h2 className="text-xl font-heading font-bold text-foreground">Comments</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Join the discussion using your GitHub account.
        </p>
      </div>
      <div ref={containerRef} />
    </section>
  );
};

export default GiscusComments;
