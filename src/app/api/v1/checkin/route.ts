import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { streakService } from '@/services/streak.service';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const requestId = crypto.randomUUID();
  logger.info('Handling POST /api/v1/checkin', { requestId });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Authentication required for check-in', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      );
    }

    const streak = await streakService.dailyCheckin(user.id);

    return NextResponse.json({
      success: true,
      data: { streak, is_first_checkin_today: true },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error('POST /api/v1/checkin failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: 'Check-in failed', code: 'CHECKIN_ERROR' } },
      { status: 500 }
    );
  }
}
