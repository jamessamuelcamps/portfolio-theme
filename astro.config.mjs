// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config.ts';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  output: 'static',
  integrations: [mdx(), sitemap()],
});