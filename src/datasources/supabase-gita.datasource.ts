import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { GitaVerse } from '@/types/gita';
import { logger } from '@/lib/logger';

// Authentic fallback dataset if DB is unreachable or during initial offline migration
const AUTHENTIC_GITA_POOL: GitaVerse[] = [
  {
    id: '00000000-0000-0000-0000-000000000247',
    chapter: 2,
    verse: 47,
    chapter_name: 'सांख्य योग (Sankhya Yoga)',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    hindi_meaning: 'तेरा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तू कर्मफल का हेतु मत बन और न ही तेरी अकर्मण्यता में आसक्ति हो।',
    english_meaning: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, nor be attached to inaction.',
    theme: 'Duty & Action (Karma Yoga)',
    keywords: ['karma', 'duty', 'focus', 'detachment', 'action'],
    life_topics: ['focus', 'procrastination', 'work-ethic', 'mental-peace'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 2.47',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000248',
    chapter: 2,
    verse: 48,
    chapter_name: 'सांख्य योग (Sankhya Yoga)',
    sanskrit: 'योगस्थ: कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्यो: समो भूत्वा समत्वं योग उच्यते ॥',
    hindi_meaning: 'हे धनंजय! सफलता और असफलता में समभाव रखते हुए, आसक्ति को त्यागकर अपने कर्तव्य का पालन कर। यह समभाव ही योग कहलाता है।',
    english_meaning: 'Perform your duty poised in yoga, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.',
    theme: 'Equanimity & Focus',
    keywords: ['yoga', 'equanimity', 'balance', 'calmness'],
    life_topics: ['stress', 'failure', 'success', 'emotional-resilience'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 2.48',
    is_featured: true,
    display_priority: 9,
  },
  {
    id: '00000000-0000-0000-0000-000000000319',
    chapter: 3,
    verse: 19,
    chapter_name: 'कर्म योग (Karma Yoga)',
    sanskrit: 'तस्मादसक्त: सततं कार्यं कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुष: ॥',
    hindi_meaning: 'अतः तू निरन्तर आसक्तिरहित होकर कर्तव्य कर्म का भलीभाँति आचरण कर; क्योंकि आसक्ति से रहित होकर कर्म करता हुआ मनुष्य परमात्मा को प्राप्त होता है।',
    english_meaning: 'Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.',
    theme: 'Selfless Execution',
    keywords: ['execution', 'discipline', 'selfless', 'excellence'],
    life_topics: ['career', 'deep-work', 'purpose'],
    difficulty: 'intermediate',
    source: 'Bhagavad Gita 3.19',
    is_featured: true,
    display_priority: 8,
  },
  {
    id: '00000000-0000-0000-0000-000000000438',
    chapter: 4,
    verse: 38,
    chapter_name: 'ज्ञानकर्मसंन्यासयोग (Transcendental Knowledge)',
    sanskrit: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।\nतत्स्वयं योगसंसिद्ध: कालेनात्मनि विन्दति ॥',
    hindi_meaning: 'इस संसार में ज्ञान के समान पवित्र करने वाला निःसंदेह कुछ भी नहीं है। उस ज्ञान को कर्मयोग में सिद्ध हुआ मनुष्य समय पाकर स्वयं अपनी आत्मा में अनुभव करता है।',
    english_meaning: 'In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism.',
    theme: 'Power of Knowledge',
    keywords: ['knowledge', 'wisdom', 'mastery', 'purity'],
    life_topics: ['learning', 'skills', 'continuous-growth'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 4.38',
    is_featured: true,
    display_priority: 8,
  },
  {
    id: '00000000-0000-0000-0000-000000000605',
    chapter: 6,
    verse: 5,
    chapter_name: 'ध्यान योग (Dhyana Yoga)',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मन: ॥',
    hindi_meaning: 'मनुष्य को चाहिए कि अपने मन के द्वारा अपना उद्धार करे, अपने को पतन की ओर न ले जाए; क्योंकि यह मन ही मनुष्य का मित्र है और मन ही उसका शत्रु है।',
    english_meaning: 'One must elevate oneself by one’s own mind, and not degrade oneself. The mind is the friend of the conditioned soul, and its enemy as well.',
    theme: 'Mind Mastery & Self-Control',
    keywords: ['mindset', 'self-control', 'discipline', 'mastery'],
    life_topics: ['self-improvement', 'mindset', 'habit-building'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 6.5',
    is_featured: true,
    display_priority: 10,
  }
];

export class SupabaseGitaDatasource {
  async getDailyVerseByDate(dateStr: string): Promise<{ verse: GitaVerse; isDailyRotation: boolean }> {
    try {
      const supabase = await createServerSupabase();
      
      // 1. Try querying daily_gita_rotation table
      const { data: rotationData, error: rotationError } = await supabase
        .from('daily_gita_rotation')
        .select('verse_id, gita_verses(*)')
        .eq('date', dateStr)
        .maybeSingle();

      if (!rotationError && rotationData && (rotationData as any).gita_verses) {
        return {
          verse: (rotationData as any).gita_verses as GitaVerse,
          isDailyRotation: true,
        };
      }

      // 2. Fallback query directly from gita_verses
      const { data: verseData, error: verseError } = await supabase
        .from('gita_verses')
        .select('*')
        .order('id', { ascending: true }); // Ensure stable ordering

      if (!verseError && verseData && verseData.length > 0) {
        // Date-seeded index into available verses
        const epochDate = new Date('2024-01-01T00:00:00Z');
        const targetDate = new Date(`${dateStr}T00:00:00Z`);
        const daysSinceEpoch = Math.floor((targetDate.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Use a prime step (e.g., 997) to pseudo-randomly jump around the array. 
        // Since 997 is prime and likely larger than the length, it guarantees a full cycle with NO repetition!
        const step = 997; 
        const index = (Math.abs(daysSinceEpoch) * step) % verseData.length;
        
        const selected = verseData[index] as GitaVerse;
        return { verse: selected, isDailyRotation: true };
      }
    } catch (err) {
      logger.warn('Failed to query Supabase gita_verses, utilizing verified authentic fallback pool', { date: dateStr, error: err });
    }

    // 3. Robust authentic fallback guarantee
    const epochDate = new Date('2024-01-01T00:00:00Z');
    const targetDate = new Date(`${dateStr}T00:00:00Z`);
    const daysSinceEpoch = Math.floor((targetDate.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const step = 997; 
    const index = (Math.abs(daysSinceEpoch) * step) % AUTHENTIC_GITA_POOL.length;
    const selected = AUTHENTIC_GITA_POOL[index];
    return { verse: selected, isDailyRotation: true };
  }

  async getAllVerses(): Promise<GitaVerse[]> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from('gita_verses')
        .select('*')
        .order('chapter', { ascending: true })
        .order('verse', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as GitaVerse[];
      }
    } catch (err) {
      logger.error('Error fetching all gita verses', err);
    }
    return AUTHENTIC_GITA_POOL;
  }
}

export const supabaseGitaDatasource = new SupabaseGitaDatasource();
