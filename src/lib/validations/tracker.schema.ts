import { z } from "zod";

export const createSubjectSchema = z.object({
  module: z.string().default("PLACEMENT"),
  exam_id: z.string().uuid().optional(),
  name: z.string().min(1, "Subject name is required").max(100, "Name too long"),
  description: z.string().optional(),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export const createTopicSchema = z.object({
  subject_id: z.string().min(1, "Subject ID is required"),
  name: z.string().min(1, "Topic name is required").max(120, "Name too long"),
  description: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Medium"),
  estimated_hours: z.coerce.number().min(0).max(1000).default(2.0),
  target_date: z.string().optional(),
  notes: z.string().optional(),
  is_learned: z.boolean().default(false),
  is_practiced: z.boolean().default(false),
  is_revised: z.boolean().default(false),
  is_mastered: z.boolean().default(false),
});

export const updateTopicSchema = createTopicSchema.partial();

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type CreateTopicInput = z.infer<typeof createTopicSchema>;
