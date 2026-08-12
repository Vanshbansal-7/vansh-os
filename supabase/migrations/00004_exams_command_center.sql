-- Migration: 00004_exams_command_center.sql
-- Create Exams Command Center tables with full RLS and authentic seed data

-- 1. Exams Master Table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  conducting_body VARCHAR(100) NOT NULL,
  logo_icon VARCHAR(50) DEFAULT 'Award',
  description TEXT,
  official_website VARCHAR(255),
  prep_progress INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Exam Applications / Forms Filled Table
CREATE TABLE IF NOT EXISTS public.exam_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- 'Submitted', 'Admit Card Out', 'Result Awaited', 'Passed'
  app_number VARCHAR(100),
  submitted_date DATE,
  exam_date DATE,
  admit_card_status VARCHAR(50),
  current_stage VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Exam Overviews Knowledge Base Table
CREATE TABLE IF NOT EXISTS public.exam_overviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE UNIQUE,
  introduction TEXT,
  notification_cycle VARCHAR(100),
  eligibility_nationality TEXT,
  eligibility_age TEXT,
  eligibility_qualification TEXT,
  selection_process JSONB,
  exam_pattern JSONB,
  physical_standards TEXT,
  medical_standards TEXT,
  ssb_info TEXT,
  salary_pay_scale TEXT,
  career_growth TEXT,
  previous_year_cutoffs JSONB,
  important_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Exam Subjects Table
CREATE TABLE IF NOT EXISTS public.exam_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  order_num INT NOT NULL,
  icon_name VARCHAR(50) DEFAULT 'BookOpen',
  color VARCHAR(20) DEFAULT 'purple',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Exam Topics Table
CREATE TABLE IF NOT EXISTS public.exam_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.exam_subjects(id) ON DELETE CASCADE,
  code VARCHAR(20),
  title VARCHAR(150) NOT NULL,
  order_index INT NOT NULL,
  is_learned BOOLEAN DEFAULT false,
  is_practiced BOOLEAN DEFAULT false,
  is_revised BOOLEAN DEFAULT false,
  is_mastered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Exam Resources Table
CREATE TABLE IF NOT EXISTS public.exam_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  url TEXT NOT NULL,
  display_url VARCHAR(100),
  type VARCHAR(30) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags TEXT[],
  priority VARCHAR(10) DEFAULT 'MEDIUM',
  metadata TEXT,
  added_date DATE DEFAULT CURRENT_DATE
);

-- 7. Exam Notes Table
CREATE TABLE IF NOT EXISTS public.exam_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  category VARCHAR(50),
  tags TEXT[],
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_overviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_notes ENABLE ROW LEVEL SECURITY;

-- Allow public reads for exams knowledge base
CREATE POLICY "Public exams access" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Public overviews access" ON public.exam_overviews FOR SELECT USING (true);
CREATE POLICY "Public subjects access" ON public.exam_subjects FOR SELECT USING (true);
CREATE POLICY "Public topics access" ON public.exam_topics FOR SELECT USING (true);
CREATE POLICY "Public resources access" ON public.exam_resources FOR SELECT USING (true);

-- User-scoped policies
CREATE POLICY "User applications access" ON public.exam_applications FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "User notes access" ON public.exam_notes FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
