import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // We will still fetch even if no user, or just return empty
    if (!user) return NextResponse.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('timetable_blocks')
      .select('*')
      .eq('user_id', user.id)
      .order('order_index', { ascending: true });

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

    const { data, error } = await supabase
      .from('timetable_blocks')
      .insert([{ ...body, user_id: user.id, created_at: new Date().toISOString() }])
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
    const { id, ...updates } = body;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });

    const { error } = await supabase
      .from('timetable_blocks')
      .update({ ...updates })
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
      .from('timetable_blocks')
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
