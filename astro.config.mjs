import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://nseinsider.co.ke',
  integrations: [
    sitemap(),
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
