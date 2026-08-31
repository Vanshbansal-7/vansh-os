const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:z4KMk75McIvb7UBF@db.otjslotfiiubgehiucmn.supabase.co:5432/postgres' });
client.connect().then(async () => {
  const res = await client.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'daily_timetable\'');
  console.log('Columns in daily_timetable:', res.rows);
  const tables = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
  console.log('Public tables:', tables.rows.map(r => r.table_name));
  await client.end();
}).catch(console.error);
