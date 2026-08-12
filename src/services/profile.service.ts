import { ProfileRepository, profileRepository } from '@/repositories/profile.repository';
import { UserProfile, UserPreferences, UpdateUserProfile, UpdateUserPreferences } from '@/types/profile';
import { resolveAvatarUrl, getInitials } from '@/utils/avatar';

export interface EnrichedUserProfile extends UserProfile {
  initials: string;
  resolved_avatar_url: string | null;
}

export class ProfileService {
  constructor(private repo: ProfileRepository = profileRepository) {}

  async getFounderProfile(): Promise<EnrichedUserProfile> {
    const profile = await this.repo.getProfile();
    return {
      ...profile,
      initials: getInitials(profile.display_name),
      resolved_avatar_url: resolveAvatarUrl(profile.avatar_url),
    };
  }

  async updateProfile(userId: string, data: UpdateUserProfile): Promise<EnrichedUserProfile> {
    const updated = await this.repo.updateProfile(userId, data);
    return {
      ...updated,
      initials: getInitials(updated.display_name),
      resolved_avatar_url: resolveAvatarUrl(updated.avatar_url),
    };
  }

  async getPreferences(userId: string): Promise<UserPreferences> {
    return this.repo.getPreferences(userId);
  }
}

export const profileService = new ProfileService();
