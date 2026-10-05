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
    // Work-page timeline summary. startDate orders studies within an
    // employer (newest first); summary falls back to description; outcome
    // stands in for highlights when a study has no hard numbers.
    startDate: z.coerce.date().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.object({ value: z.string(), label: z.string() })).max(3).default([]),
    outcome: z.string().optional(),
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

