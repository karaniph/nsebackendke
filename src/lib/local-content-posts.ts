import fs from "node:fs";
import path from "node:path";
import type { BlogPost, PostCategory } from "./blog-data";
import { sanitizeRemoteBlogContent } from "./blog-content";

const CONTENT_DIR = path.resolve(process.cwd(), "src", "content", "blog");

interface Frontmatter {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  category?: string;
  tags?: string[];
  slug?: string;
  draft?: boolean;
}

function normalizeCategory(category: string | undefined): PostCategory {
  if (category === "deep-dives") return "deep-dives";
  if (category === "education") return "education";
  if (category === "bot-updates") return "bot-updates";
  return "market-briefs";
}

function inferAuthorRole(category: PostCategory): string {
  if (category === "education") return "Education Desk";
  if (category === "bot-updates") return "Product Desk";
  return "Market Intelligence Desk";
}

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(source: string): { frontmatter: Frontmatter; content: string } | null {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const frontmatter: Frontmatter = {};
  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();

    if (key === "tags") {
      try {
        frontmatter.tags = JSON.parse(rawValue) as string[];
      } catch (_error) {
        frontmatter.tags = [];
      }
      continue;
    }

    if (key === "draft") {
      frontmatter.draft = rawValue === "true";
      continue;
    }

    frontmatter[key as keyof Frontmatter] = stripQuotes(rawValue) as never;
  }

  return {
    frontmatter,
    content: match[2].trim(),
  };
}

export function getLocalContentPosts(): BlogPost[] {
  let filenames: string[] = [];

  try {
    filenames = fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".md"));
  } catch (_error) {
    return [];
  }

  return filenames
    .map((filename) => {
      const fullPath = path.join(CONTENT_DIR, filename);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = parseFrontmatter(raw);
      if (!parsed?.frontmatter.title || !parsed.frontmatter.date || !parsed.frontmatter.slug) {
        return null;
      }

      const category = normalizeCategory(parsed.frontmatter.category);
      return {
        slug: parsed.frontmatter.slug,
        title: parsed.frontmatter.title,
        description: parsed.frontmatter.description || "NSEinsider market update.",
        date: parsed.frontmatter.date,
        updatedAt: parsed.frontmatter.date,
        author: parsed.frontmatter.author || "NSEinsider Desk",
        authorRole: inferAuthorRole(category),
        tags: parsed.frontmatter.tags || [],
        category,
        coverImage: "",
        draft: parsed.frontmatter.draft ?? false,
        content: sanitizeRemoteBlogContent(parsed.content),
      } satisfies BlogPost;
    })
    .filter((post): post is BlogPost => Boolean(post));
}

