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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });

    const task = await tasksService.createTask(body, user.id);
    if (!task) throw new Error("Failed to create task");

    return NextResponse.json({ success: true, data: task });
  } catch (err) {
    logger.error('POST /api/v1/priorities failed', { err });
    return NextResponse.json({ success: false, error: { message: 'Failed to create priority' } }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });

    const success = await tasksService.editTask(id, user.id, updates);
    if (!success) throw new Error("Failed to edit task");

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('PATCH /api/v1/priorities failed', { err });
    return NextResponse.json({ success: false, error: { message: 'Failed to edit priority' } }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error("Missing ID");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });

    const success = await tasksService.deleteTask(id, user.id);
    if (!success) throw new Error("Failed to delete task");

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('DELETE /api/v1/priorities failed', { err });
    return NextResponse.json({ success: false, error: { message: 'Failed to delete priority' } }, { status: 500 });
  }
}
