import type { BlogPost } from "@/lib/blog-data";

const STORAGE_KEY = "nseinsider.followed_topics.v1";

export const DEFAULT_TOPICS = [
  "market-briefs",
  "deep-dives",
  "education",
  "dividend",
  "banking",
  "safaricom",
  "cbk"
];

export function loadFollowedTopics(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t) => typeof t === "string");
  } catch {
    return [];
  }
}

export function saveFollowedTopics(topics: string[]): void {
  if (typeof window === "undefined") return;
  const cleaned = Array.from(new Set(topics.map((t) => t.trim().toLowerCase()).filter(Boolean)));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
}

export function scorePostForTopics(post: BlogPost, topics: string[]): number {
  if (topics.length === 0) return 0;
  const bag = new Set<string>([
    post.category,
    ...post.tags.map((t) => t.toLowerCase()),
    ...post.title.toLowerCase().split(/\W+/)
  ]);
  let score = 0;
  for (const topic of topics) {
    if (bag.has(topic.toLowerCase())) score += 1;
  }
  return score;
}

export function getPersonalizedPosts(posts: BlogPost[], topics: string[], limit = 4): BlogPost[] {
  return posts
    .map((post) => ({ post, score: scorePostForTopics(post, topics) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map((item) => item.post);
}

