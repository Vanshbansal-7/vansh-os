import { z } from 'zod';

export const CGLTopicSchema = z.object({
  id: z.string(),
  code: z.string(), // e.g. "1.1", "1.2"
  title: z.string(), // e.g. "Analogy", "Coding Decoding"
  progress: z.number().min(0).max(100),
  completed_milestones: z.number().min(0).max(4),
  total_milestones: z.number().default(4),
  is_learned: z.boolean().default(false),
  is_practiced: z.boolean().default(false),
  is_revised: z.boolean().default(false),
  is_mastered: z.boolean().default(false),
  order_index: z.number().default(1),
});

export const CGLSubjectSchema = z.object({
  id: z.string(),
  order_num: z.number(), // 1, 2, 3, 4, 5
  title: z.string(), // "Reasoning Ability", "Quantitative Aptitude", etc.
  icon_name: z.string(),
  color: z.string(),
  progress: z.number().min(0).max(100),
  completed_topics: z.number(),
  total_topics: z.number(),
  topics: z.array(CGLTopicSchema),
});

export const CGLTrackerMetricsSchema = z.object({
  overall_progress: z.number().default(68),
  topics_completed: z.number().default(142),
  total_topics: z.number().default(208),
  revision_pending: z.number().default(37),
  remaining_topics: z.number().default(66),
  total_study_time: z.string().default('182h 45m'),
});

export const CGLResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['youtube', 'document', 'website', 'telegram', 'mock_test', 'book']),
  metadata: z.string(), // e.g. "YouTube Playlist • 120 Videos"
  tags: z.array(z.string()),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  url: z.string(),
  display_url: z.string(),
  added_date: z.string(),
});

export const CGLNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  description: z.string().optional(),
  folder: z.string(),
  tags: z.array(z.string()),
  format: z.string().default('MD'),
  is_pinned: z.boolean().default(false),
  updated_date: z.string(),
  word_count: z.number(),
});

export const CGLExamOverviewSchema = z.object({
  conducting_body: z.string().default('Staff Selection Commission (SSC)'),
  exam_level: z.string().default('National Level'),
  frequency: z.string().default('Once a Year'),
  eligibility: z.string().default('Graduate from Recognized University'),
  age_limit: z.string().default('18 – 32 Years'),
  selection_process: z.string().default('Tier I → Tier II → Tier III → DV'),
  negative_marking: z.string().default('0.50 Marks'),
  mode_of_exam: z.string().default('Online'),
  official_website: z.string().default('https://ssc.nic.in'),
});

export type CGLTopic = z.infer<typeof CGLTopicSchema>;
export type CGLSubject = z.infer<typeof CGLSubjectSchema>;
export type CGLTrackerMetrics = z.infer<typeof CGLTrackerMetricsSchema>;
export type CGLResource = z.infer<typeof CGLResourceSchema>;
export type CGLNote = z.infer<typeof CGLNoteSchema>;
export type CGLExamOverview = z.infer<typeof CGLExamOverviewSchema>;
export type CGLTabId = 'overview' | 'resources' | 'notes' | 'tracker';
