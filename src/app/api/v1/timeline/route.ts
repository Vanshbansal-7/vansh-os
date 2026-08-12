import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { timetableService } from '@/services/timetable.service';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info('Handling GET /api/v1/timeline', { requestId });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const entries = await timetableService.getTodaysTimeline(userId);

    return NextResponse.json({
      success: true,
      data: entries,
      meta: { count: entries.length, generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error('GET /api/v1/timeline failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch timeline', code: 'TIMELINE_ERROR' } },
      { status: 500 }
    );
  }
}
