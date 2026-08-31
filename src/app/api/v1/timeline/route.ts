export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { timetableService } from '@/services/timetable.service';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info('Handling GET /api/v1/timeline', { requestId });

  try {
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      // Unauthenticated / Founder mode
    }

    const entries = await timetableService.getTodaysTimeline(userId);

    return NextResponse.json({
      success: true,
      data: entries,
      meta: { count: entries.length, generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error('GET /api/v1/timeline failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to fetch timeline', code: 'TIMELINE_ERROR' } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      // Unauthenticated / Founder mode
    }

    const entry = await timetableService.createEntry(body, userId);
    if (!entry) throw new Error("Failed to create timeline entry");

    return NextResponse.json({ success: true, data: entry });
  } catch (err: any) {
    logger.error('POST /api/v1/timeline failed', { err });
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to create timeline entry' } }, { status: 500 });
  }
}
