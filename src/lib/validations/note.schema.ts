import { z } from "zod";

export const createNoteSchema = z.object({
  module: z.string().default("PLACEMENT"),
  exam_id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required").max(120, "Title too long"),
  content: z.string().min(1, "Note content is required"),
  tags: z.array(z.string()).default([]),
});

export const updateNoteSchema = createNoteSchema.partial();

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
