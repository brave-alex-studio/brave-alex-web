import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const WORK_PATH = "src/data/work";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${WORK_PATH}` }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      date: z.date(),
      url: z.string().url().optional(),
      image: image(),
      tags: z.array(z.string()).default([]),
    }),
});

export const collections = { blog, work };
