const PDF_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+\.pdf(?:\?[^)\s]*)?)\)/gi;
const PDF_URL_RE = /https?:\/\/\S+\.pdf(?:\?\S*)?/gi;
const EXTRACTION_PHRASE_RE = /\b(?:the )?(?:document|report)[’']?s? contents? (?:were|was) not accessible for summary due to technical extraction issues\b/gi;
const FEED_FAILURE_PHRASE_RE = /\bAI summary skipped because text extraction failed in worker runtime\.?/gi;

const REMOVABLE_LINE_PATTERNS = [
  /^>\s?.*$/i,
  /^- .*captured from source URL\.?$/i,
  /^- .*AI summary skipped because text extraction failed.*$/i,
  /^- Source:\s+https?:\/\/\S+\.pdf(?:\?\S*)?\s*$/i,
  /^[-*]\s+.*filing captured\.?$/i,
  /^[-*]\s+.*Detailed summary is pending further processing\.?$/i,
  /^[-*]\s+.*Source:\s*$/i,
  /^[-*]\s+.*\*\*Key Financial Numbers\*\*: (?:No specific financial figures disclosed|Not explicitly stated).*/i,
  /^[-*]\s+.*\*\*Important Announcements\*\*: Published an updated .*price list.*/i,
  /^[-*]\s+.*\*\*Risks Mentioned\*\*: None specified.*/i,
  /^[-*]\s+.*\*\*Company(?: Name & Filing Type| & Filing)\*\*: .*price list.*$/i,
  /^[-*]\s+.*\*\*Key Details\*\*: The filing provides a .*price list.*/i,
  /^[-*]\s+.*\*\*Important Notes\*\*: No explicit financial numbers.*$/i,
];

export function sanitizeRemoteBlogContent(content: string): string {
  const sanitizedLines = dedupeLines(
    content
    .split(/\r?\n/)
    .filter((line) => !REMOVABLE_LINE_PATTERNS.some((pattern) => pattern.test(line.trim()))),
  );

  return pruneEmptySections(
    sanitizedLines
    .join("\n")
    .replace(PDF_LINK_RE, "$1")
    .replace(PDF_URL_RE, "")
    .replace(EXTRACTION_PHRASE_RE, "the report was not summarized in the feed")
    .replace(FEED_FAILURE_PHRASE_RE, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\(\s*\)/g, "")
    .trim(),
  );
}

function dedupeLines(lines: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const line of lines) {
    const normalized = line.trim().toLowerCase();
    if (normalized && seen.has(normalized)) continue;
    if (normalized) seen.add(normalized);
    deduped.push(line);
  }

  return deduped;
}

function pruneEmptySections(content: string): string {
  const lines = content.split("\n");
  const kept: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(/^(##+)\s+/);
    if (!match) {
      kept.push(line);
      continue;
    }
    const level = match[1].length;

    let j = i + 1;
    while (j < lines.length) {
      const nextMatch = lines[j].match(/^(##+)\s+/);
      if (nextMatch && nextMatch[1].length <= level) break;
      if (lines[j].trim()) break;
      j += 1;
    }

    const nextMatch = j < lines.length ? lines[j].match(/^(##+)\s+/) : null;
    if (nextMatch && nextMatch[1].length <= level) {
      continue;
    }

    kept.push(line);
  }

  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
