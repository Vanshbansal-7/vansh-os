-- ============================================================
-- Phase 4 — VOS Dashboard Production Schema
-- Migration: 00003_phase4_dashboard.sql
-- ============================================================

-- -------------------------------------------------------
-- 1. daily_checkins — powers the streak engine
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_checkins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  completed     BOOLEAN NOT NULL DEFAULT FALSE,
  completion_time TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_checkins_user_only"
  ON daily_checkins FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, date DESC);

-- -------------------------------------------------------
-- 2. streaks — summary stats per user
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS streaks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak   INT NOT NULL DEFAULT 0,
  longest_streak   INT NOT NULL DEFAULT 0,
  last_checkin_date DATE,
  monthly_streak   INT NOT NULL DEFAULT 0,
  yearly_streak    INT NOT NULL DEFAULT 0,
  weekly_pattern   JSONB DEFAULT '[]'::jsonb,
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streaks_user_only"
  ON streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- 3. daily_timetable — powers the timeline widget
-- -------------------------------------------------------
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
  day_of_week INT[] DEFAULT '{0,1,2,3,4,5,6}', -- 0=Sunday, 6=Saturday
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

-- -------------------------------------------------------
-- 4. daily_tasks — powers today's priorities widget
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  subtitle        TEXT,
  category        TEXT NOT NULL DEFAULT 'General',
  priority_level  TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority_level IN ('HIGH', 'MEDIUM', 'LOW')),
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  due_date        DATE DEFAULT CURRENT_DATE,
  due_time        TIME,
  source          TEXT DEFAULT 'manual',
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_tasks_user_only"
  ON daily_tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON daily_tasks(user_id, due_date, is_active);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_priority ON daily_tasks(priority_level, completed);

-- -------------------------------------------------------
-- 5. daily_quotes — motivational quote rotation
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_quotes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote        TEXT NOT NULL,
  author       TEXT NOT NULL DEFAULT 'Unknown',
  theme        TEXT,
  priority     INT DEFAULT 5,
  display_date DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Public read access for quotes (no auth required for inspiration)
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_quotes_public_read"
  ON daily_quotes FOR SELECT
  USING (TRUE);

CREATE INDEX IF NOT EXISTS idx_daily_quotes_date ON daily_quotes(display_date);

-- -------------------------------------------------------
-- SEED DATA — daily_quotes
-- -------------------------------------------------------
INSERT INTO daily_quotes (quote, author, theme, priority) VALUES
  ('Consistency is the foundation of virtue.', 'Francis Bacon', 'discipline', 10),
  ('The secret of your future is hidden in your daily routine.', 'Mike Murdock', 'habit', 10),
  ('Motivation gets you going, but discipline keeps you growing.', 'John C. Maxwell', 'discipline', 9),
  ('You don''t rise to the level of your goals; you fall to the level of your systems.', 'James Clear', 'systems', 10),
  ('Work hard in silence, let success make the noise.', 'Frank Ocean', 'focus', 9),
  ('The man who moves a mountain begins by carrying away small stones.', 'Confucius', 'perseverance', 9),
  ('One day or day one. You decide.', 'Paulo Coelho', 'action', 9),
  ('It always seems impossible until it is done.', 'Nelson Mandela', 'perseverance', 8),
  ('Small steps in the right direction can turn out to be the biggest step of your life.', 'Unknown', 'progress', 8),
  ('Don''t watch the clock; do what it does. Keep going.', 'Sam Levenson', 'persistence', 8),
  ('Success is the sum of small efforts, repeated day in and day out.', 'Robert Collier', 'consistency', 9),
  ('The harder you work for something, the greater you will feel when you achieve it.', 'Unknown', 'effort', 8),
  ('Stop doubting yourself, work hard, and make it happen.', 'Unknown', 'confidence', 8),
  ('Your future is created by what you do today, not tomorrow.', 'Robert Kiyosaki', 'action', 9),
  ('Dreams don''t work unless you do.', 'John C. Maxwell', 'action', 9)
ON CONFLICT DO NOTHING;
