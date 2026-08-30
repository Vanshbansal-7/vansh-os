import { timetableRepository } from '@/repositories/timetable.repository';
import { TimetableEntry } from '@/types/dashboard';

export class TimetableService {
  async getTodaysTimeline(userId?: string): Promise<TimetableEntry[]> {
    return timetableRepository.getTodaysTimetable(userId);
  }

  async createEntry(entry: Partial<TimetableEntry>, userId: string): Promise<TimetableEntry | null> {
    return timetableRepository.createEntry(entry, userId);
  }
}

export const timetableService = new TimetableService();
