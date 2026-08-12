import { z } from 'zod';

export const UserRoleSchema = z.enum(['FOUNDER', 'ADMIN', 'MEMBER']);

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string().min(1, 'Display name is required'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar_url: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  designation: z.string().default('Founder & Lead Architect'),
  role: UserRoleSchema.default('FOUNDER'),
  timezone: z.string().default('Asia/Kolkata'),
  locale: z.string().default('en-IN'),
  theme: z.string().default('dark'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const UpdateUserProfileSchema = UserProfileSchema.partial().omit({ id: true });

export const UserPreferencesSchema = z.object({
  user_id: z.string().uuid(),
  theme: z.enum(['dark', 'light', 'system']).default('dark'),
  accent_color: z.string().default('purple'),
  language: z.string().default('en'),
  timezone: z.string().default('Asia/Kolkata'),
  time_format: z.enum(['12h', '24h']).default('24h'),
  week_start: z.enum(['monday', 'sunday']).default('monday'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    reminders: z.boolean().default(true),
  }).default({ email: true, push: true, reminders: true }),
  sidebar_collapsed: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const UpdateUserPreferencesSchema = UserPreferencesSchema.partial().omit({ user_id: true });

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UpdateUserPreferences = z.infer<typeof UpdateUserPreferencesSchema>;
