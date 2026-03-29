const PDF_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+\.pdf(?:\?[^)\s]*)?)\)/gi;
const PDF_URL_RE = /https?:\/\/\S+\.pdf(?:\?\S*)?/gi;
const EXTRACTION_PHRASE_RE = /\b(?:the )?(?:document|report)[’']?s? contents? (?:were|was) not accessible for summary due to technical extraction issues\b/gi;
const FEED_FAILURE_PHRASE_RE = /\bAI summary skipped because text extraction failed in worker runtime\.?/gi;

const REMOVABLE_LINE_PATTERNS = [
  /^- .*captured from source URL\.?$/i,
  /^- .*AI summary skipped because text extraction failed.*$/i,
  /^- Source:\s+https?:\/\/\S+\.pdf(?:\?\S*)?\s*$/i,
];

export function sanitizeRemoteBlogContent(content: string): string {
  const sanitizedLines = content
    .split(/\r?\n/)
    .filter((line) => !REMOVABLE_LINE_PATTERNS.some((pattern) => pattern.test(line.trim())));

  return sanitizedLines
    .join("\n")
    .replace(PDF_LINK_RE, "$1")
    .replace(PDF_URL_RE, "")
    .replace(EXTRACTION_PHRASE_RE, "the report was not summarized in the feed")
    .replace(FEED_FAILURE_PHRASE_RE, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\(\s*\)/g, "")
    .trim();
}
