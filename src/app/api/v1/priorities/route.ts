export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { tasksService } from '@/services/tasks.service';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info('Handling GET /api/v1/priorities', { requestId });

  try {
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      // Unauthenticated / Founder mode
    }

    const tasks = await tasksService.getTodaysPriorities(userId);

    return NextResponse.json({
      success: true,
      data: tasks,
      meta: { count: tasks.length, generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error('GET /api/v1/priorities failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to fetch priorities', code: 'PRIORITIES_ERROR' } },
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

    const task = await tasksService.createTask(body, userId);
    if (!task) throw new Error("Failed to create task");

    return NextResponse.json({ success: true, data: task });
  } catch (err: any) {
    logger.error('POST /api/v1/priorities failed', { err });
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to create priority' } }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      // Unauthenticated / Founder mode
    }

    const success = await tasksService.editTask(id, userId, updates);
    if (!success) throw new Error("Failed to edit task");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    logger.error('PATCH /api/v1/priorities failed', { err });
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to edit priority' } }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error("Missing ID");

    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      // Unauthenticated / Founder mode
    }

    const success = await tasksService.deleteTask(id, userId);
    if (!success) throw new Error("Failed to delete task");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    logger.error('DELETE /api/v1/priorities failed', { err });
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to delete priority' } }, { status: 500 });
  }
}
