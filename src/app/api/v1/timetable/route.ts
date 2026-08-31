export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';

const dayMap: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otjslotfiiubgehiucmn.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk'
  );
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('daily_timetable')
      .select('*')
      .eq('is_active', true)
      .order('start_time', { ascending: true });

    if (error) {
      logger.error('GET /api/v1/timetable DB error', { error });
      throw error;
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    logger.error('GET /api/v1/timetable failed', { err });
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to fetch timetable blocks' } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dayInt = dayMap[body.day];
    if (dayInt === undefined) throw new Error("Invalid day");

    const newEntry: any = {
      title: body.title,
      start_time: body.start_time,
      end_time: body.end_time,
      day_of_week: [dayInt],
      category: body.category || 'General',
      priority: body.priority || 'MEDIUM',
      status: 'upcoming',
      recurring: true,
      is_active: true,
    };

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('daily_timetable')
      .insert([newEntry])
      .select()
      .single();

    if (error) {
      logger.error('POST /api/v1/timetable DB error', { error, newEntry });
      throw error;
    }
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    logger.error('POST /api/v1/timetable failed', { err });
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to create block' } }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, start_time, end_time } = body;

    const updates: any = {};
    if (title) updates.title = title;
    if (start_time) updates.start_time = start_time;
    if (end_time) updates.end_time = end_time;
    updates.updated_at = new Date().toISOString();

    const supabase = getSupabase();
    const { error } = await supabase
      .from('daily_timetable')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    logger.error('PATCH /api/v1/timetable failed', { err });
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to update block' } }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('id parameter is required');

    const supabase = getSupabase();
    const { error } = await supabase
      .from('daily_timetable')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    logger.error('DELETE /api/v1/timetable failed', { err });
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to delete block' } }, { status: 500 });
  }
}
