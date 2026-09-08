import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Product Design Case Studies Collection
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    client: z.string().optional(),
    role: z.string().optional(),
    timeline: z.string().optional(),
    heroImage: image().optional(),
    heroImageAlt: z.string().optional(),
    heroLayout: z.enum(['inset', 'wide']).default('inset'),
    tags: z.array(z.string()).default([]),
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

/**
 * Design Writing & Articles Collection
 */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    canonicalUrl: z.string().optional(),
  }),
});

export const collections = {
  projects,
  writing,
};

