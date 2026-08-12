-- Vansh OS Master Production Database Migration
-- Enables Supabase persistence for all modules: Founder Profile, Streak Engine, Companies ATS, Placement, Exams, YouTube, and Documents Vault

-- 1. Founder Profiles & Streak Tracking
CREATE TABLE IF NOT EXISTS public.founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Vansh Bansal',
  title TEXT NOT NULL DEFAULT 'FOUNDER',
  passcode TEXT NOT NULL DEFAULT '2005',
  avatar_url TEXT DEFAULT '/assets/founder_avatar.png',
  current_streak INTEGER NOT NULL DEFAULT 14,
  best_streak INTEGER NOT NULL DEFAULT 42,
  last_checkin_date DATE DEFAULT CURRENT_DATE,
  total_checkins INTEGER NOT NULL DEFAULT 42,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founder profiles viewable by owner" ON public.founder_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Founder profiles editable by owner" ON public.founder_profiles FOR ALL USING (auth.uid() = user_id);

-- 2. Daily Priorities
CREATE TABLE IF NOT EXISTS public.daily_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  priority_level TEXT NOT NULL DEFAULT 'HIGH',
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.daily_priorities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Priorities managed by owner" ON public.daily_priorities FOR ALL USING (auth.uid() = user_id);

-- 3. Companies ATS Applications
CREATE TABLE IF NOT EXISTS public.company_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  role TEXT NOT NULL,
  applied_date TEXT NOT NULL,
  application_mode TEXT NOT NULL DEFAULT 'Off Campus',
  job_link TEXT,
  status TEXT NOT NULL DEFAULT 'Applied',
  location TEXT NOT NULL DEFAULT 'Bangalore',
  notes TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.company_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company apps managed by owner" ON public.company_applications FOR ALL USING (auth.uid() = user_id);

-- 4. YouTube Video Tasks
CREATE TABLE IF NOT EXISTS public.youtube_video_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Content',
  is_idea BOOLEAN NOT NULL DEFAULT TRUE,
  is_script BOOLEAN NOT NULL DEFAULT FALSE,
  is_editing BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.youtube_video_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "YouTube tasks managed by owner" ON public.youtube_video_tasks FOR ALL USING (auth.uid() = user_id);

-- 5. Digital Documents Vault
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  modified_date TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  storage_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Documents managed by owner" ON public.user_documents FOR ALL USING (auth.uid() = user_id);

-- Seed Indexes
CREATE INDEX IF NOT EXISTS idx_companies_user ON public.company_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_yt_tasks_user ON public.youtube_video_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.user_documents(user_id);
