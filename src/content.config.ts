import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    period: z.string(),
    title: z.string(),
    org: z.string().optional(),
    blurb: z.string(),
    kind: z.enum(['role', 'project', 'education']),
    href: z.string().optional(),
    order: z.number(), // for sorting (higher = more recent = shown first)
  }),
});

export const collections = { work };
