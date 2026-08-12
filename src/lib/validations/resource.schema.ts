import { z } from "zod";

export const createResourceSchema = z.object({
  module: z.string().default("PLACEMENT"),
  exam_id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required").max(120, "Title too long"),
  url: z.string().min(1, "URL is required"),
  category: z.string().default("General"),
  type: z.string().default("website"),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  tags: z.array(z.string()).default([]),
  metadata: z.string().optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
