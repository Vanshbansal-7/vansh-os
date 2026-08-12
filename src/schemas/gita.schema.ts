import { z } from 'zod';

export const GitaVerseSchema = z.object({
  id: z.string().uuid(),
  chapter: z.number().int().min(1).max(18),
  verse: z.number().int().min(1),
  chapter_name: z.string().min(1),
  sanskrit: z.string().min(1),
  hindi_meaning: z.string().min(1),
  english_meaning: z.string().min(1),
  theme: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  life_topics: z.array(z.string()).default([]),
  difficulty: z.enum(['foundational', 'intermediate', 'advanced']).default('foundational'),
  source: z.string().default('Bhagavad Gita As It Is'),
  is_featured: z.boolean().default(true),
  display_priority: z.number().int().default(1),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const DailyGitaVerseResponseSchema = z.object({
  date: z.string(),
  verse: GitaVerseSchema,
  is_daily_rotation: z.boolean(),
  cached_at: z.string(),
});

export const GitaVerseQuerySchema = z.object({
  chapter: z.coerce.number().int().min(1).max(18).optional(),
  theme: z.string().optional(),
  life_topic: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type GitaVerse = z.infer<typeof GitaVerseSchema>;
export type DailyGitaVerseResponse = z.infer<typeof DailyGitaVerseResponseSchema>;
export type GitaVerseQuery = z.infer<typeof GitaVerseQuerySchema>;
