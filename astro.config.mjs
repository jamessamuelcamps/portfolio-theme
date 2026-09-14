// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://james-sc.co.uk',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // Keep the hidden kitchen-sink case study out of the sitemap
      filter: (page) => !page.includes('/work/kitchen-sink'),
    }),
  ],
});