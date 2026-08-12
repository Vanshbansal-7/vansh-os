import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { streakService } from '@/services/streak.service';
import { createClient } from '@/lib/supabase/server';

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

// Zero-state for unauthenticated / no-data users
const ZERO_STREAK_RESPONSE = {
  current_streak: 0,
  longest_streak: 0,
  last_checkin_date: null,
  monthly_streak: 0,
  yearly_streak: 0,
  weekly_pattern: [],
  checked_in_today: false,
};

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info('Handling GET /api/v1/streak', { requestId });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        success: true,
        data: ZERO_STREAK_RESPONSE,
        meta: { auth: false, generated_at: new Date().toISOString() },
      });
    }

    const streak = await streakService.getStreak(user.id);
    return NextResponse.json({ success: true, data: streak });
  } catch (err) {
    logger.error('GET /api/v1/streak failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch streak', code: 'STREAK_ERROR' } },
      { status: 500 }
    );
  }
}
