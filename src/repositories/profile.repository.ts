import { SupabaseProfileDatasource, supabaseProfileDatasource } from '@/datasources/supabase-profile.datasource';
import { UserProfile, UserPreferences, UpdateUserProfile, UpdateUserPreferences } from '@/types/profile';

export interface IProfileRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(userId: string, data: UpdateUserProfile): Promise<UserProfile>;
  getPreferences(userId: string): Promise<UserPreferences>;
}

export class ProfileRepository implements IProfileRepository {
  constructor(private datasource: SupabaseProfileDatasource = supabaseProfileDatasource) {}

  async getProfile(): Promise<UserProfile> {
    return this.datasource.getProfile();
  }

  async updateProfile(userId: string, data: UpdateUserProfile): Promise<UserProfile> {
    return this.datasource.updateProfile(userId, data);
  }

  async getPreferences(userId: string): Promise<UserPreferences> {
    return this.datasource.getPreferences(userId);
  }
}

export const profileRepository = new ProfileRepository();
