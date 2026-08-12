-- Vansh OS Phase X — Production Modules CRUD Database Schema
-- Supports Placement, CGL, Exams, and YouTube Creator Engine modules

-- 1. Universal Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL, -- 'PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE'
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  type TEXT NOT NULL DEFAULT 'Article', -- 'Video', 'PDF', 'Course', 'Repo'
  priority TEXT NOT NULL DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
  tags TEXT[] DEFAULT '{}',
  favorite BOOLEAN NOT NULL DEFAULT FALSE,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources managed by owner" ON public.resources FOR ALL USING (auth.uid() = user_id);

-- 2. Tracker Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL, -- 'PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE'
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subjects managed by owner" ON public.subjects FOR ALL USING (auth.uid() = user_id);

-- 3. Tracker Topics & 4-Check Milestones Table
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
  estimated_hours NUMERIC DEFAULT 2.0,
  target_date DATE,
  notes TEXT,
  is_learned BOOLEAN NOT NULL DEFAULT FALSE,
  is_practiced BOOLEAN NOT NULL DEFAULT FALSE,
  is_revised BOOLEAN NOT NULL DEFAULT FALSE,
  is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Topics managed by owner" ON public.topics FOR ALL USING (auth.uid() = user_id);

-- 4. Universal Notes Table
CREATE TABLE IF NOT EXISTS public.module_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.module_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notes managed by owner" ON public.module_notes FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_module ON public.resources(user_id, module);
CREATE INDEX IF NOT EXISTS idx_subjects_module ON public.subjects(user_id, module);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON public.topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_module ON public.module_notes(user_id, module);
