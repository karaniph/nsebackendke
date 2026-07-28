// src/lib/markdown.ts
// Build-time markdown -> HTML rendering.
//
// Post bodies used to be rendered in the browser by react-markdown +
// rehype-raw + react-syntax-highlighter, a ~1.09 MB client bundle shipped to
// every reader to render text that could be produced once at build time. This
// renders on the server with micromark (already present via Astro's own
// toolchain), so the post island no longer needs any markdown library.
//
// The corpus contains no raw HTML (checked across the feed), so micromark's
// default HTML escaping is the sanitiser — nothing dangerous survives.
import { micromark } from "micromark";
import type { PostHeading } from "./post-intelligence";

/**
 * Renders normalised post markdown to HTML and injects heading ids that match
 * the table of contents.
 *
 * `headings` comes from extractHeadings() on the same normalised markdown, so it
 * lists the h2/h3 in document order — exactly the order micromark emits them.
 * Walking both in lockstep guarantees every "On this page" anchor resolves,
 * including duplicate headings that get a numeric suffix.
 */
export function renderPostHtml(normalizedMarkdown: string, headings: PostHeading[]): string {
  const html = micromark(normalizedMarkdown, {
    allowDangerousHtml: false,
  });

  let index = 0;
  return html.replace(/<(h2|h3)>/g, (match, tag) => {
    const heading = headings[index++];
    return heading ? `<${tag} id="${heading.id}">` : match;
  });
}

/** Plain text for text-to-speech, stripped of tags and collapsed whitespace. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
