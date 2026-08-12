import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { StreakData, WeekDay } from '@/types/dashboard';

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

function getISTDateStr(): string {
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  return nowIST.toISOString().split('T')[0];
}

function buildWeeklyPattern(checkinsMap: Record<string, boolean>, today: string): WeekDay[] {
  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const pattern: WeekDay[] = [];
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  const todayDow = nowIST.getUTCDay();

  // Show last 7 days ending today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(nowIST.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dow = d.getUTCDay();

    let status: WeekDay['status'];
    if (dateStr > today) {
      status = 'future';
    } else if (dateStr === today) {
      status = checkinsMap[dateStr] ? 'completed' : 'active';
    } else {
      status = checkinsMap[dateStr] ? 'completed' : 'pending';
    }

    pattern.push({ day: DAY_LABELS[dow], date: dateStr, status });
  }

  return pattern;
}

const ZERO_STREAK: StreakData = {
  current_streak: 0,
  longest_streak: 0,
  last_checkin_date: null,
  monthly_streak: 0,
  yearly_streak: 0,
  weekly_pattern: [],
  checked_in_today: false,
};

export class SupabaseStreakDatasource {
  async getStreak(userId: string): Promise<StreakData> {
    const today = getISTDateStr();

    try {
      const supabase = await createClient();

      // Get streak summary
      const { data: streakRow, error: streakErr } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Get last 7 days of checkins
      const sevenDaysAgo = new Date(Date.now() + IST_OFFSET_MS - 6 * 86400000)
        .toISOString()
        .split('T')[0];

      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('date, completed')
        .eq('user_id', userId)
        .gte('date', sevenDaysAgo)
        .lte('date', today);

      const checkinsMap: Record<string, boolean> = {};
      (checkins || []).forEach((c: any) => {
        checkinsMap[c.date] = c.completed;
      });

      const checkedInToday = checkinsMap[today] === true;
      const pattern = buildWeeklyPattern(checkinsMap, today);

      if (!streakErr && streakRow) {
        return {
          current_streak: streakRow.current_streak || 0,
          longest_streak: streakRow.longest_streak || 0,
          last_checkin_date: streakRow.last_checkin_date || null,
          monthly_streak: streakRow.monthly_streak || 0,
          yearly_streak: streakRow.yearly_streak || 0,
          weekly_pattern: pattern,
          checked_in_today: checkedInToday,
        };
      }
    } catch (err) {
      logger.warn('Failed to fetch streak from DB', { userId, err });
    }

    // Return zero state if no data — never fake numbers
    return {
      ...ZERO_STREAK,
      weekly_pattern: buildWeeklyPattern({}, today),
    };
  }

  async checkin(userId: string): Promise<StreakData> {
    const today = getISTDateStr();

    try {
      const supabase = await createClient();

      // Upsert today's checkin
      await supabase
        .from('daily_checkins')
        .upsert(
          { user_id: userId, date: today, completed: true, completion_time: new Date().toISOString() },
          { onConflict: 'user_id,date' }
        );

      // Re-calculate streak
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('date, completed')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('date', { ascending: false })
        .limit(400);

      let currentStreak = 0;
      let checkDate = today;
      const dateSet = new Set<string>((checkins || []).map((c: any) => c.date));

      while (dateSet.has(checkDate)) {
        currentStreak++;
        const prev = new Date(new Date(checkDate).getTime() - 86400000);
        checkDate = prev.toISOString().split('T')[0];
      }

      // Get existing longest
      const { data: existingStreak } = await supabase
        .from('streaks')
        .select('longest_streak, monthly_streak, yearly_streak')
        .eq('user_id', userId)
        .maybeSingle();

      const longestStreak = Math.max(currentStreak, existingStreak?.longest_streak || 0);

      // Upsert streak summary
      await supabase
        .from('streaks')
        .upsert(
          {
            user_id: userId,
            current_streak: currentStreak,
            longest_streak: longestStreak,
            last_checkin_date: today,
            monthly_streak: existingStreak?.monthly_streak || currentStreak,
            yearly_streak: existingStreak?.yearly_streak || currentStreak,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      return this.getStreak(userId);
    } catch (err) {
      logger.error('Checkin failed', { userId, err });
      return this.getStreak(userId);
    }
  }
}

export const supabaseStreakDatasource = new SupabaseStreakDatasource();
