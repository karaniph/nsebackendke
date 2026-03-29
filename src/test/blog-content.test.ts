import { describe, expect, it } from "vitest";

import { sanitizeRemoteBlogContent } from "@/lib/blog-content";

describe("sanitizeRemoteBlogContent", () => {
  it("removes source-url boilerplate and pdf links", () => {
    const input = `## Financial Trend\n- Filing Highlights\n- N/A | Announcement | Daily wrap captured from source URL.\n- AI summary skipped because text extraction failed in worker runtime.\n- Source: https://example.com/report.pdf\n\nSee the [Daily Market Wrap](https://example.com/report.pdf) for context.`;

    expect(sanitizeRemoteBlogContent(input)).toBe(`## Financial Trend\n- Filing Highlights\n\nSee the Daily Market Wrap for context.`);
  });

  it("softens extraction-failure prose inside narrative paragraphs", () => {
    const input = `Kingdom Securities published its [Daily Market Wrap](https://example.com/report.pdf). However, the document's contents were not accessible for summary due to technical extraction issues, leaving traders cautious.`;

    expect(sanitizeRemoteBlogContent(input)).toBe(
      "Kingdom Securities published its Daily Market Wrap. However, the report was not summarized in the feed, leaving traders cautious.",
    );
  });
});
