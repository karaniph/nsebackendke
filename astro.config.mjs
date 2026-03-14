import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
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
