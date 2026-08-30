export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

const dayMap: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('daily_timetable')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('start_time', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err) {
    logger.error('GET /api/v1/timetable failed', { err });
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch timetable blocks' } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });

    const dayInt = dayMap[body.day];
    if (dayInt === undefined) throw new Error("Invalid day");

    const newEntry = {
      title: body.title,
      start_time: body.start_time,
      end_time: body.end_time,
      day_of_week: [dayInt],
      category: 'General',
      priority: 'MEDIUM',
      recurring: true,
      is_active: true,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('daily_timetable')
      .insert([newEntry])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    logger.error('POST /api/v1/timetable failed', { err });
    return NextResponse.json({ success: false, error: { message: 'Failed to create block' } }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, start_time, end_time } = body;
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });

    const updates: any = {};
    if (title) updates.title = title;
    if (start_time) updates.start_time = start_time;
    if (end_time) updates.end_time = end_time;
    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('daily_timetable')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('PATCH /api/v1/timetable failed', { err });
    return NextResponse.json({ success: false, error: { message: 'Failed to update block' } }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });

    const { error } = await supabase
      .from('daily_timetable')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('DELETE /api/v1/timetable failed', { err });
    return NextResponse.json({ success: false, error: { message: 'Failed to delete block' } }, { status: 500 });
  }
}
