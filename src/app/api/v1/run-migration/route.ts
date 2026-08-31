import { NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = new Client({ connectionString: 'postgresql://postgres:z4KMk75McIvb7UBF@db.otjslotfiiubgehiucmn.supabase.co:5432/postgres' });
  try {
    await client.connect();
    
    const checkRes = await client.query(\SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_timetable');\);
    const exists = checkRes.rows[0].exists;
    
    if (exists) {
      const cols = await client.query(\SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'daily_timetable'\);
      await client.end();
      return NextResponse.json({ message: 'Table already exists', columns: cols.rows });
    }

    const sql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'migrations', '00003_phase4_dashboard.sql'), 'utf-8');
    await client.query(sql);
    
    const verifyCols = await client.query(\SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'daily_timetable'\);
    await client.end();
    
    return NextResponse.json({ message: 'Migration applied successfully', columns: verifyCols.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
