// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Replace with your actual domain when deploying to Dreamhost
  site: 'https://jamessamuelcamps.com',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // Keep the hidden kitchen-sink case study out of the sitemap
      filter: (page) => !page.includes('/work/kitchen-sink'),
    }),
  ],
});