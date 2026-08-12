import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { tasksService } from '@/services/tasks.service';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info('Handling GET /api/v1/priorities', { requestId });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const tasks = await tasksService.getTodaysPriorities(userId);

    return NextResponse.json({
      success: true,
      data: tasks,
      meta: { count: tasks.length, generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error('GET /api/v1/priorities failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch priorities', code: 'PRIORITIES_ERROR' } },
      { status: 500 }
    );
  }
}
