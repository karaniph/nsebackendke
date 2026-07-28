import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://nseinsider.co.ke',
  integrations: [
    sitemap({
      // @astrojs/sitemap is now the single source of truth. The hand-rolled
      // generate-sitemap.ts wrote a second, conflicting public/sitemap.xml whose
      // URLs had no trailing slash while the canonicals do.
      filter: (page) =>
        // /rss/ is served with noindex, so it does not belong in a sitemap.
        !page.includes('/rss/') &&
        // Generated Open Graph PNG endpoints are assets, not pages.
        !page.includes('/og/'),
    }),
    react(),
    tailwind({
      applyBaseStyles: false, // We already load our Tailwind CSS in our layouts
    }),
  ],
  output: 'static', 
  devToolbar: {
    enabled: false
  }
});
