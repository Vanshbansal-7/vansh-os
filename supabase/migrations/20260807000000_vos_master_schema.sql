-- ============================================================================
-- VANSH OS (VOS) — MASTER PRODUCTION DATABASE SCHEMA
-- Migration: 20260807000000_vos_master_schema.sql
-- Project Reference: otjslotfiiubgehiucmn
-- ============================================================================

-- 1. Helper Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. TABLE: document_folders
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    parent_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'purple',
    icon TEXT DEFAULT 'Folder',
    item_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own document_folders" ON document_folders;
DROP POLICY IF EXISTS "Allow full access for document_folders" ON document_folders;
CREATE POLICY "Allow full access for document_folders" ON document_folders
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_document_folders_updated_at ON document_folders;
CREATE TRIGGER update_document_folders_updated_at
    BEFORE UPDATE ON document_folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 3. TABLE: user_documents
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    folder_id UUID REFERENCES document_folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('PDF', 'DOCX', 'PNG', 'JPG', 'ZIP')),
    category TEXT NOT NULL CHECK (category IN ('Study Materials', 'Placement', 'Projects', 'Certificates', 'Personal', 'College')),
    size TEXT DEFAULT '0 KB',
    size_bytes BIGINT DEFAULT 0,
    storage_path TEXT,
    download_url TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own user_documents" ON user_documents;
DROP POLICY IF EXISTS "Allow full access for user_documents" ON user_documents;
CREATE POLICY "Allow full access for user_documents" ON user_documents
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_user_documents_updated_at ON user_documents;
CREATE TRIGGER update_user_documents_updated_at
    BEFORE UPDATE ON user_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 4. TABLE: company_applications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    company_name TEXT NOT NULL,
    logo_url TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'Software Engineer',
    applied_date TEXT NOT NULL,
    application_mode TEXT NOT NULL CHECK (application_mode IN ('On Campus', 'Off Campus', 'Referral', 'LinkedIn', 'Careers Page')),
    job_link TEXT DEFAULT '',
    status TEXT NOT NULL CHECK (status IN ('Applied', 'Assessment', 'Interview', 'Selected', 'Rejected', 'Offer Received', 'Withdrawn')),
    location TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own company_applications" ON company_applications;
DROP POLICY IF EXISTS "Allow full access for company_applications" ON company_applications;
CREATE POLICY "Allow full access for company_applications" ON company_applications
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_company_applications_updated_at ON company_applications;
CREATE TRIGGER update_company_applications_updated_at
    BEFORE UPDATE ON company_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 5. TABLE: exams
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Defense', 'SSC', 'Banking', 'UPSC', 'State PCS')),
    conducting_body TEXT DEFAULT '',
    official_website TEXT DEFAULT '',
    description TEXT DEFAULT '',
    logo_icon TEXT DEFAULT 'Award',
    prep_progress NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own exams" ON exams;
DROP POLICY IF EXISTS "Allow full access for exams" ON exams;
CREATE POLICY "Allow full access for exams" ON exams
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_exams_updated_at ON exams;
CREATE TRIGGER update_exams_updated_at
    BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 6. TABLE: exam_applications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    exam_name TEXT NOT NULL,
    exam_slug TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Submitted', 'Admit Card Out', 'Result Awaited', 'Passed', 'In Progress')),
    app_number TEXT DEFAULT '',
    submitted_date TEXT NOT NULL,
    exam_date TEXT NOT NULL,
    admit_card_status TEXT DEFAULT 'Pending',
    current_stage TEXT DEFAULT 'Stage 1',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exam_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own exam_applications" ON exam_applications;
DROP POLICY IF EXISTS "Allow full access for exam_applications" ON exam_applications;
CREATE POLICY "Allow full access for exam_applications" ON exam_applications
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_exam_applications_updated_at ON exam_applications;
CREATE TRIGGER update_exam_applications_updated_at
    BEFORE UPDATE ON exam_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 7. TABLE: subjects
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    module TEXT NOT NULL CHECK (module IN ('PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE')),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    icon_name TEXT DEFAULT 'BookOpen',
    color TEXT DEFAULT 'purple',
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own subjects" ON subjects;
DROP POLICY IF EXISTS "Allow full access for subjects" ON subjects;
CREATE POLICY "Allow full access for subjects" ON subjects
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_subjects_updated_at ON subjects;
CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 8. TABLE: topics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
    code TEXT DEFAULT '',
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    estimated_hours NUMERIC DEFAULT 2.0,
    target_date TEXT,
    notes TEXT DEFAULT '',
    is_learned BOOLEAN DEFAULT FALSE,
    is_practiced BOOLEAN DEFAULT FALSE,
    is_revised BOOLEAN DEFAULT FALSE,
    is_mastered BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own topics" ON topics;
DROP POLICY IF EXISTS "Allow full access for topics" ON topics;
CREATE POLICY "Allow full access for topics" ON topics
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_topics_updated_at ON topics;
CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 9. TABLE: youtube_channels
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS youtube_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    channel_name TEXT NOT NULL,
    channel_handle TEXT DEFAULT '',
    channel_url TEXT DEFAULT '',
    niche TEXT DEFAULT 'General',
    subscribers TEXT DEFAULT '0',
    total_videos INTEGER DEFAULT 0,
    description TEXT DEFAULT '',
    upload_frequency TEXT DEFAULT 'Weekly',
    content_focus_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own youtube_channels" ON youtube_channels;
DROP POLICY IF EXISTS "Allow full access for youtube_channels" ON youtube_channels;
CREATE POLICY "Allow full access for youtube_channels" ON youtube_channels
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_youtube_channels_updated_at ON youtube_channels;
CREATE TRIGGER update_youtube_channels_updated_at
    BEFORE UPDATE ON youtube_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 10. TABLE: youtube_video_tasks
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS youtube_video_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    channel_id UUID REFERENCES youtube_channels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Content',
    is_idea BOOLEAN DEFAULT TRUE,
    is_script BOOLEAN DEFAULT FALSE,
    is_editing BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE youtube_video_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own youtube_video_tasks" ON youtube_video_tasks;
DROP POLICY IF EXISTS "Allow full access for youtube_video_tasks" ON youtube_video_tasks;
CREATE POLICY "Allow full access for youtube_video_tasks" ON youtube_video_tasks
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_youtube_video_tasks_updated_at ON youtube_video_tasks;
CREATE TRIGGER update_youtube_video_tasks_updated_at
    BEFORE UPDATE ON youtube_video_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 11. TABLE: notes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    module TEXT NOT NULL CHECK (module IN ('GENERAL', 'EXAMS', 'YOUTUBE', 'CGL', 'PLACEMENT')),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    category TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notes" ON notes;
DROP POLICY IF EXISTS "Allow full access for notes" ON notes;
CREATE POLICY "Allow full access for notes" ON notes
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 12. TABLE: resources
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    module TEXT NOT NULL CHECK (module IN ('GENERAL', 'EXAMS', 'YOUTUBE', 'CGL', 'PLACEMENT')),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    display_url TEXT DEFAULT '',
    type TEXT DEFAULT 'website',
    category TEXT DEFAULT 'General',
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    metadata TEXT DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own resources" ON resources;
DROP POLICY IF EXISTS "Allow full access for resources" ON resources;
CREATE POLICY "Allow full access for resources" ON resources
    FOR ALL USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 13. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_documents_user_folder ON user_documents(user_id, folder_id);
CREATE INDEX IF NOT EXISTS idx_company_applications_user_status ON company_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subjects_user_module ON subjects(user_id, module);
CREATE INDEX IF NOT EXISTS idx_topics_user_subject ON topics(user_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_user_slug ON exams(user_id, slug);
CREATE INDEX IF NOT EXISTS idx_youtube_tasks_user ON youtube_video_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_module ON notes(user_id, module);
CREATE INDEX IF NOT EXISTS idx_resources_user_module ON resources(user_id, module);

-- ----------------------------------------------------------------------------
-- 14. SUPABASE STORAGE BUCKET CONFIGURATION
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('vos-documents', 'vos-documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow full access for vos-documents bucket" ON storage.objects;
CREATE POLICY "Allow full access for vos-documents bucket" ON storage.objects
    FOR ALL USING (bucket_id = 'vos-documents') WITH CHECK (bucket_id = 'vos-documents');
