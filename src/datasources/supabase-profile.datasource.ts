import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { UserProfile, UserPreferences } from '@/types/profile';
import { logger } from '@/lib/logger';

const DEFAULT_FOUNDER_PROFILE: UserProfile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  display_name: 'Vansh Bansal',
  username: 'vanshbansal',
  email: 'vansh@vos.internal',
  avatar_url: '/assets/founder_avatar.png',
  bio: 'Architecting Vansh OS — Personal Operating System for High Agency Execution',
  designation: 'Founder & Lead Architect',
  role: 'FOUNDER',
  timezone: 'Asia/Kolkata',
  locale: 'en-IN',
  theme: 'dark',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  user_id: 'a0000000-0000-0000-0000-000000000001',
  theme: 'dark',
  accent_color: 'purple',
  language: 'en',
  timezone: 'Asia/Kolkata',
  time_format: '24h',
  week_start: 'monday',
  notifications: { email: true, push: true, reminders: true },
  sidebar_collapsed: false,
};

export class SupabaseProfileDatasource {
  async getProfile(): Promise<UserProfile> {
    try {
      const supabase = await createServerSupabase();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (user && !authError) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profile && !profileError) {
          return profile as UserProfile;
        }

        // Return profile created from auth user metadata
        return {
          id: user.id,
          display_name: user.user_metadata?.full_name || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Vansh Bansal',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'founder',
          email: user.email || 'founder@vos.internal',
          avatar_url: user.user_metadata?.avatar_url || '/assets/founder_avatar.png',
          bio: user.user_metadata?.bio || '',
          designation: 'Founder & Lead Architect',
          role: (user.user_metadata?.role as any) || 'FOUNDER',
          timezone: 'Asia/Kolkata',
          locale: 'en-IN',
          theme: 'dark',
        };
      }
    } catch (err) {
      logger.warn('Could not connect to Supabase auth for profile, using active founder profile', { error: err });
    }

    return DEFAULT_FOUNDER_PROFILE;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (!error && data) {
        return data as UserProfile;
      }
    } catch (err) {
      logger.error('Failed to update profile in Supabase', err, { userId });
    }

    return { ...DEFAULT_FOUNDER_PROFILE, ...updates };
  }

  async getPreferences(userId: string): Promise<UserPreferences> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        return data as UserPreferences;
      }
    } catch (err) {
      logger.warn('Could not fetch preferences, using defaults', { userId, error: err });
    }

    return { ...DEFAULT_PREFERENCES, user_id: userId };
  }
}

export const supabaseProfileDatasource = new SupabaseProfileDatasource();
