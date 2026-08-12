import { streakRepository } from '@/repositories/streak.repository';
import { StreakData } from '@/types/dashboard';

export class StreakService {
  async getStreak(userId: string): Promise<StreakData> {
    return streakRepository.getStreak(userId);
  }

  async dailyCheckin(userId: string): Promise<StreakData> {
    return streakRepository.checkin(userId);
  }
}

export const streakService = new StreakService();
