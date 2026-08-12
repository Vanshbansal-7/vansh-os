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

// Authentic fallback seed data (when DB has no data or user is not auth'd)
const SEED_TIMETABLE: Omit<TimetableEntry, 'id' | 'user_id'>[] = [
  { title: 'Wake Up & Fresh', category: 'Health', start_time: '07:00', end_time: '08:00', priority: 'MEDIUM', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'emerald' },
  { title: 'DSA – Graphs & DP', category: 'Deep Work', start_time: '08:00', end_time: '09:30', priority: 'HIGH', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'purple' },
  { title: 'Core Subjects – OS Unit 4', category: 'Deep Work', start_time: '10:00', end_time: '11:30', priority: 'HIGH', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'purple' },
  { title: 'Apply to 2 Companies', category: 'Career', start_time: '12:00', end_time: '13:00', priority: 'HIGH', status: 'upcoming', recurring: true, day_of_week: [1,2,3,4,5], is_active: true, color_tag: 'blue' },
  { title: 'Lunch & Rest', category: 'Life', start_time: '13:00', end_time: '14:00', priority: 'LOW', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'slate' },
  { title: 'SSC CGL – Quant Practice', category: 'CGL', start_time: '14:00', end_time: '15:00', priority: 'HIGH', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'sky' },
  { title: 'DBMS Revision & Practice', category: 'Learning', start_time: '15:00', end_time: '16:30', priority: 'MEDIUM', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'sky' },
  { title: 'Defense Prep – Navy', category: 'Defense', start_time: '17:00', end_time: '19:00', priority: 'HIGH', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'teal' },
  { title: 'Football Training', category: 'Health', start_time: '19:00', end_time: '20:00', priority: 'MEDIUM', status: 'upcoming', recurring: true, day_of_week: [1,2,3,4,5,6], is_active: true, color_tag: 'emerald' },
  { title: 'Dinner & Family', category: 'Life', start_time: '20:00', end_time: '21:00', priority: 'LOW', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'amber' },
  { title: 'Read + Journal', category: 'Review', start_time: '21:00', end_time: '22:00', priority: 'MEDIUM', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'slate' },
  { title: 'Plan Tomorrow', category: 'Review', start_time: '22:00', end_time: '22:30', priority: 'MEDIUM', status: 'upcoming', recurring: true, day_of_week: [0,1,2,3,4,5,6], is_active: true, color_tag: 'slate' },
];

function applyStatus(entries: Omit<TimetableEntry, 'id' | 'user_id'>[]): TimetableEntry[] {
  const { timeStr, dayOfWeek } = getISTDateAndTime();
  return entries
    .filter(e => e.day_of_week.includes(dayOfWeek) && e.is_active)
    .map((e, idx) => {
      const status = calculateStatus(e.start_time, e.end_time, timeStr);
      const elapsed = status === 'in_progress' ? calcElapsed(e.start_time, timeStr) : undefined;
      return {
        ...e,
        id: `seed-${idx}`,
        user_id: 'anonymous',
        status,
        elapsed,
        window: `${e.start_time} – ${e.end_time}`,
      };
    });
}

export class SupabaseTimetableDatasource {
  async getTodaysTimetable(userId?: string): Promise<TimetableEntry[]> {
    const { timeStr, dayOfWeek } = getISTDateAndTime();

    if (!userId) {
      logger.info('No userId — returning seed timetable', { timeStr });
      return applyStatus(SEED_TIMETABLE);
    }

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
      logger.warn('Failed to fetch timetable from DB, using seed', { err });
    }

    return applyStatus(SEED_TIMETABLE);
  }
}

export const supabaseTimetableDatasource = new SupabaseTimetableDatasource();
