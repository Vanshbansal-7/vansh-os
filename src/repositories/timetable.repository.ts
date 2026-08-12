import { supabaseTimetableDatasource } from '@/datasources/supabase-timetable.datasource';
import { TimetableEntry } from '@/types/dashboard';

export class TimetableRepository {
  async getTodaysTimetable(userId?: string): Promise<TimetableEntry[]> {
    return supabaseTimetableDatasource.getTodaysTimetable(userId);
  }
}

export const timetableRepository = new TimetableRepository();
