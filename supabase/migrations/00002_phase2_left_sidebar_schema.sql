-- 00002_phase2_left_sidebar_schema.sql
-- Vansh OS — Phase 2: Left Sidebar Production Schema & Authentic Seeds

-- 1. Create User Role Enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('FOUNDER', 'ADMIN', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Ensure Profiles Table matches extended schema
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    display_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    designation TEXT DEFAULT 'Founder & Lead Architect',
    role user_role DEFAULT 'FOUNDER' NOT NULL,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    locale TEXT DEFAULT 'en-IN',
    theme TEXT DEFAULT 'dark',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If profiles already existed, safely alter/add missing columns
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS designation TEXT DEFAULT 'Founder & Lead Architect';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'FOUNDER';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Kolkata';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en-IN';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';
EXCEPTION
    WHEN others THEN null;
END $$;

-- 3. Create User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark',
    accent_color TEXT DEFAULT 'purple',
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    time_format TEXT DEFAULT '24h',
    week_start TEXT DEFAULT 'monday',
    notifications JSONB DEFAULT '{"email": true, "push": true, "reminders": true}'::jsonb,
    sidebar_collapsed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Bhagavad Gita Knowledge Base Table
CREATE TABLE IF NOT EXISTS public.gita_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    chapter_name TEXT NOT NULL,
    sanskrit TEXT NOT NULL,
    hindi_meaning TEXT NOT NULL,
    english_meaning TEXT NOT NULL,
    theme TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}'::text[],
    life_topics TEXT[] DEFAULT '{}'::text[],
    difficulty TEXT DEFAULT 'foundational',
    source TEXT DEFAULT 'Bhagavad Gita As It Is',
    is_featured BOOLEAN DEFAULT true,
    display_priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_chapter_verse UNIQUE(chapter, verse)
);

-- Index for rapid filtering and daily queries
CREATE INDEX IF NOT EXISTS idx_gita_theme ON public.gita_verses(theme);
CREATE INDEX IF NOT EXISTS idx_gita_chapter_verse ON public.gita_verses(chapter, verse);

-- 5. Create Daily Gita Rotation Mapping Table
CREATE TABLE IF NOT EXISTS public.daily_gita_rotation (
    date DATE PRIMARY KEY,
    verse_id UUID NOT NULL REFERENCES public.gita_verses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rotation_date ON public.daily_gita_rotation(date);

-- 6. RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gita_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_gita_rotation ENABLE ROW LEVEL SECURITY;

-- Public read for gita_verses and daily rotation
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can view gita verses" ON public.gita_verses;
    CREATE POLICY "Public can view gita verses" ON public.gita_verses FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public can view daily gita rotation" ON public.daily_gita_rotation;
    CREATE POLICY "Public can view daily gita rotation" ON public.daily_gita_rotation FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Users can view all public profiles" ON public.profiles;
    CREATE POLICY "Users can view all public profiles" ON public.profiles FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
    CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
    CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN others THEN null;
END $$;

-- 7. Seed Authentic Bhagavad Gita Verses
INSERT INTO public.gita_verses (
    chapter, verse, chapter_name, sanskrit, hindi_meaning, english_meaning, theme, keywords, life_topics, difficulty, source, is_featured, display_priority
) VALUES
(
    2, 47, 'सांख्य योग (Sankhya Yoga)',
    'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    'तेरा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तू कर्मफल का हेतु मत बन और न ही तेरी अकर्मण्यता में आसक्ति हो।',
    'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, nor be attached to inaction.',
    'Duty & Action (Karma Yoga)',
    ARRAY['karma', 'duty', 'focus', 'detachment', 'action'],
    ARRAY['focus', 'procrastination', 'work-ethic', 'mental-peace'],
    'foundational', 'Bhagavad Gita 2.47', true, 10
),
(
    2, 48, 'सांख्य योग (Sankhya Yoga)',
    'योगस्थ: कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।
सिद्ध्यसिद्ध्यो: समो भूत्वा समत्वं योग उच्यते ॥',
    'हे धनंजय! सफलता और असफलता में समभाव रखते हुए, आसक्ति को त्यागकर अपने कर्तव्य का पालन कर। यह समभाव ही योग कहलाता है।',
    'Perform your duty poised in yoga, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.',
    'Equanimity & Focus',
    ARRAY['yoga', 'equanimity', 'balance', 'calmness'],
    ARRAY['stress', 'failure', 'success', 'emotional-resilience'],
    'foundational', 'Bhagavad Gita 2.48', true, 9
),
(
    3, 19, 'कर्म योग (Karma Yoga)',
    'तस्मादसक्त: सततं कार्यं कर्म समाचर ।
असक्तो ह्याचरन्कर्म परमाप्नोति पूरुष: ॥',
    'अतः तू निरन्तर आसक्तिरहित होकर कर्तव्य कर्म का भलीभाँति आचरण कर; क्योंकि आसक्ति से रहित होकर कर्म करता हुआ मनुष्य परमात्मा को प्राप्त होता है।',
    'Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.',
    'Selfless Execution',
    ARRAY['execution', 'discipline', 'selfless', 'excellence'],
    ARRAY['career', 'deep-work', 'purpose'],
    'intermediate', 'Bhagavad Gita 3.19', true, 8
),
(
    4, 38, 'ज्ञानकर्मसंन्यासयोग (Transcendental Knowledge)',
    'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।
तत्स्वयं योगसंसिद्ध: कालेनात्मनि विन्दति ॥',
    'इस संसार में ज्ञान के समान पवित्र करने वाला निःसंदेह कुछ भी नहीं है। उस ज्ञान को कर्मयोग में सिद्ध हुआ मनुष्य समय पाकर स्वयं अपनी आत्मा में अनुभव करता है।',
    'In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism.',
    'Power of Knowledge',
    ARRAY['knowledge', 'wisdom', 'mastery', 'purity'],
    ARRAY['learning', 'skills', 'continuous-growth'],
    'foundational', 'Bhagavad Gita 4.38', true, 8
),
(
    6, 5, 'ध्यान योग (Dhyana Yoga)',
    'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।
आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मन: ॥',
    'मनुष्य को चाहिए कि अपने मन के द्वारा अपना उद्धार करे, अपने को पतन की ओर न ले जाए; क्योंकि यह मन ही मनुष्य का मित्र है और मन ही उसका शत्रु है।',
    'One must elevate oneself by one’s own mind, and not degrade oneself. The mind is the friend of the conditioned soul, and its enemy as well.',
    'Mind Mastery & Self-Control',
    ARRAY['mindset', 'self-control', 'discipline', 'mastery'],
    ARRAY['self-improvement', 'mindset', 'habit-building'],
    'foundational', 'Bhagavad Gita 6.5', true, 10
),
(
    9, 22, 'राजविद्याराजगुह्ययोग (Sovereign Knowledge)',
    'अनन्याश्चिन्तयन्तो मां ये जना: पर्युपासते ।
तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥',
    'जो अनन्य भाव से मेरा चिन्तन करते हुए मेरी उपासना करते हैं, उन नित्य युक्त पुरुषों के योगक्षेम (अप्राप्त की प्राप्ति और प्राप्त की रक्षा) का वहन मैं स्वयं करता हूँ।',
    'To those who are constantly devoted and who worship Me with love, I provide what they lack and preserve what they have.',
    'Divine Assurance & Faith',
    ARRAY['faith', 'devotion', 'protection', 'assurance'],
    ARRAY['peace-of-mind', 'fearlessness', 'trust'],
    'intermediate', 'Bhagavad Gita 9.22', true, 7
),
(
    18, 66, 'मोक्षसंन्यासयोग (Liberation through Renunciation)',
    'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।
अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुच: ॥',
    'सब धर्मों का त्याग कर केवल मेरी शरण में आ जा। मैं तुझे समस्त पापों से मुक्त कर दूंगा, तू शोक मत कर।',
    'Abandon all varieties of dharmas and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not fear.',
    'Ultimate Surrender & Courage',
    ARRAY['surrender', 'courage', 'liberation', 'strength'],
    ARRAY['courage', 'fearlessness', 'clarity'],
    'foundational', 'Bhagavad Gita 18.66', true, 9
)
ON CONFLICT (chapter, verse) DO UPDATE SET
    hindi_meaning = EXCLUDED.hindi_meaning,
    english_meaning = EXCLUDED.english_meaning,
    theme = EXCLUDED.theme,
    keywords = EXCLUDED.keywords,
    life_topics = EXCLUDED.life_topics,
    updated_at = NOW();

-- 8. Seed Default Daily Rotation Mapping (Dynamic date seeding for 2025/2026)
DO $$
DECLARE
    v_id_247 UUID;
    v_id_248 UUID;
    v_id_319 UUID;
    v_id_438 UUID;
    v_id_65 UUID;
    v_id_922 UUID;
    v_id_1866 UUID;
    d DATE;
    idx INTEGER := 0;
    verse_ids UUID[];
BEGIN
    SELECT id INTO v_id_247 FROM public.gita_verses WHERE chapter = 2 AND verse = 47;
    SELECT id INTO v_id_248 FROM public.gita_verses WHERE chapter = 2 AND verse = 48;
    SELECT id INTO v_id_319 FROM public.gita_verses WHERE chapter = 3 AND verse = 19;
    SELECT id INTO v_id_438 FROM public.gita_verses WHERE chapter = 4 AND verse = 38;
    SELECT id INTO v_id_65 FROM public.gita_verses WHERE chapter = 6 AND verse = 5;
    SELECT id INTO v_id_922 FROM public.gita_verses WHERE chapter = 9 AND verse = 22;
    SELECT id INTO v_id_1866 FROM public.gita_verses WHERE chapter = 18 AND verse = 66;

    verse_ids := ARRAY[v_id_247, v_id_248, v_id_319, v_id_438, v_id_65, v_id_922, v_id_1866];

    -- Populate 365 days of rotation starting from 2025-01-01
    FOR i IN 0..365 LOOP
        d := DATE '2025-01-01' + i;
        idx := (i % array_length(verse_ids, 1)) + 1;
        INSERT INTO public.daily_gita_rotation (date, verse_id)
        VALUES (d, verse_ids[idx])
        ON CONFLICT (date) DO UPDATE SET verse_id = EXCLUDED.verse_id;
    END LOOP;

    -- Also populate 2026 dates
    FOR i IN 0..365 LOOP
        d := DATE '2026-01-01' + i;
        idx := (i % array_length(verse_ids, 1)) + 1;
        INSERT INTO public.daily_gita_rotation (date, verse_id)
        VALUES (d, verse_ids[idx])
        ON CONFLICT (date) DO UPDATE SET verse_id = EXCLUDED.verse_id;
    END LOOP;
END $$;
