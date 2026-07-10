import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    tag: z.enum(["Proyecto personal", "Proyecto académico", "Proyecto de infraestructura"]),
    summary: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    highlights: z.array(z.string()),
    githubUrl: z.string().url().nullable().optional(),
    liveUrl: z.string().url().nullable().optional(),
    order: z.number(),
    diagramMermaid: z.string().nullable().optional(),
  }),
});

export const collections = {
  projects,
};
