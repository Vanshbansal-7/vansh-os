import { timetableRepository } from '@/repositories/timetable.repository';
import { TimetableEntry } from '@/types/dashboard';

export class TimetableService {
  async getTodaysTimeline(userId?: string): Promise<TimetableEntry[]> {
    return timetableRepository.getTodaysTimetable(userId);
  }
}

export const timetableService = new TimetableService();
