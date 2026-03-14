import { generateRSSFeed } from '../lib/blog-data';

export async function GET() {
  const rss = generateRSSFeed();
  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
