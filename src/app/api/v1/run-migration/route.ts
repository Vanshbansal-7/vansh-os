import { NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = new Client({ connectionString: 'postgresql://postgres:z4KMk75McIvb7UBF@db.otjslotfiiubgehiucmn.supabase.co:5432/postgres' });
  try {
    await client.connect();
    
    const checkRes = await client.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_timetable');");
    const exists = checkRes.rows[0].exists;
    
    if (exists) {
      const cols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'daily_timetable'");
      await client.end();
      return NextResponse.json({ message: 'Table already exists', columns: cols.rows });
    }

    const sql = `
CREATE TABLE IF NOT EXISTS daily_timetable (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'General',
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  priority    TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  status      TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'skipped')),
  recurring   BOOLEAN DEFAULT TRUE,
  day_of_week INT[] DEFAULT '{0,1,2,3,4,5,6}',
  is_active   BOOLEAN DEFAULT TRUE,
  color_tag   TEXT DEFAULT 'purple',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE daily_timetable ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_timetable_user_only"
  ON daily_timetable FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_timetable_user ON daily_timetable(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_daily_timetable_start ON daily_timetable(start_time);
`;
    await client.query(sql);
    
    const verifyCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'daily_timetable'");
    await client.end();
    
    return NextResponse.json({ message: 'Migration applied successfully', columns: verifyCols.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
