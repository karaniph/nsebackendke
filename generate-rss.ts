import fs from 'fs';
import path from 'path';
import { generateRSSFeed } from './src/lib/blog-data';

const xml = generateRSSFeed();
const dest = path.resolve(process.cwd(), 'public', 'rss.xml');

fs.writeFileSync(dest, xml);
console.log(`✅ Generated RSS feed at ${dest}`);
