import { NextResponse, NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { tasksService } from '@/services/tasks.service';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requestId = crypto.randomUUID();
  logger.info('Handling PATCH /api/v1/priorities/[id]/complete', { requestId, taskId: id });

  if (!id) {
    return NextResponse.json(
      { success: false, error: { message: 'Task ID is required', code: 'INVALID_ID' } },
      { status: 400 }
    );
  }

  try {
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      // Unauthenticated / Founder mode
    }

    const body = await request.json().catch(() => ({}));
    const completed = typeof body.completed === 'boolean' ? body.completed : true;

    const ok = await tasksService.toggleComplete(id, userId, completed);

    if (!ok) {
      return NextResponse.json(
        { success: false, error: { message: 'Failed to update task', code: 'UPDATE_FAILED' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { id, completed } });
  } catch (err: any) {
    logger.error('PATCH /api/v1/priorities/[id]/complete failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Server error', code: 'SERVER_ERROR' } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(request, context);
}
