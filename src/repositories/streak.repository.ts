import { supabaseStreakDatasource } from '@/datasources/supabase-streak.datasource';
import { StreakData } from '@/types/dashboard';

export class StreakRepository {
  async getStreak(userId: string): Promise<StreakData> {
    return supabaseStreakDatasource.getStreak(userId);
  }

  async checkin(userId: string): Promise<StreakData> {
    return supabaseStreakDatasource.checkin(userId);
  }
}

export const streakRepository = new StreakRepository();
