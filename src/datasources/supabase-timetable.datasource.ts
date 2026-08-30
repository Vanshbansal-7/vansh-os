import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { TimetableEntry, TimetableStatus } from '@/types/dashboard';

// IST offset = UTC+5:30
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

function getISTDateAndTime(): { timeStr: string; dayOfWeek: number } {
  const nowUtc = Date.now();
  const nowIST = new Date(nowUtc + IST_OFFSET_MS);
  const hours = nowIST.getUTCHours().toString().padStart(2, '0');
  const mins = nowIST.getUTCMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${mins}`;
  const dayOfWeek = nowIST.getUTCDay(); // 0=Sun
  return { timeStr, dayOfWeek };
}

function calculateStatus(startTime: string, endTime: string, currentTime: string): TimetableStatus {
  if (currentTime >= endTime) return 'completed';
  if (currentTime >= startTime) return 'in_progress';
  return 'upcoming';
}

function calcElapsed(startTime: string, currentTime: string): string {
  const [sh, sm] = startTime.split(':').map(Number);
  const [ch, cm] = currentTime.split(':').map(Number);
  const diffMins = (ch * 60 + cm) - (sh * 60 + sm);
  const hours = Math.floor(diffMins / 60).toString().padStart(2, '0');
  const mins = (diffMins % 60).toString().padStart(2, '0');
  return `${hours}:${mins}:00`;
}

export class SupabaseTimetableDatasource {
  async getTodaysTimetable(userId?: string): Promise<TimetableEntry[]> {
    if (!userId) return [];

    const { timeStr, dayOfWeek } = getISTDateAndTime();

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('daily_timetable')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .contains('day_of_week', [dayOfWeek])
        .order('start_time', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((e: any) => ({
          ...e,
          status: calculateStatus(e.start_time, e.end_time, timeStr),
          elapsed: calculateStatus(e.start_time, e.end_time, timeStr) === 'in_progress'
            ? calcElapsed(e.start_time, timeStr)
            : undefined,
          window: `${e.start_time.slice(0, 5)} – ${e.end_time.slice(0, 5)}`,
        }));
      }
    } catch (err) {
      logger.warn('Failed to fetch timetable from DB', { err });
    }

    return [];
  }

  async createEntry(entry: Partial<TimetableEntry>, userId: string): Promise<TimetableEntry | null> {
    try {
      const supabase = await createClient();
      const newEntry = {
        ...entry,
        user_id: userId,
      };

      const { data, error } = await supabase
        .from('daily_timetable')
        .insert([newEntry])
        .select()
        .single();

      if (!error && data) return data as TimetableEntry;
      logger.error('Failed to create timeline entry', { error });
    } catch (err) {
      logger.error('Create timeline entry exception', { err });
    }
    return null;
  }
}

export const supabaseTimetableDatasource = new SupabaseTimetableDatasource();
