import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { DailyQuote } from '@/types/dashboard';

// Fallback pool — used when DB is unreachable
const QUOTE_POOL: DailyQuote[] = [
  { id: 'q1', quote: 'Consistency is the foundation of virtue.', author: 'Francis Bacon', theme: 'discipline' },
  { id: 'q2', quote: 'The secret of your future is hidden in your daily routine.', author: 'Mike Murdock', theme: 'habit' },
  { id: 'q3', quote: 'Motivation gets you going, but discipline keeps you growing.', author: 'John C. Maxwell', theme: 'discipline' },
  { id: 'q4', quote: "You don't rise to the level of your goals; you fall to the level of your systems.", author: 'James Clear', theme: 'systems' },
  { id: 'q5', quote: 'Work hard in silence, let success make the noise.', author: 'Frank Ocean', theme: 'focus' },
  { id: 'q6', quote: 'The man who moves a mountain begins by carrying away small stones.', author: 'Confucius', theme: 'perseverance' },
  { id: 'q7', quote: 'One day or day one. You decide.', author: 'Paulo Coelho', theme: 'action' },
  { id: 'q8', quote: 'It always seems impossible until it is done.', author: 'Nelson Mandela', theme: 'perseverance' },
  { id: 'q9', quote: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier', theme: 'consistency' },
  { id: 'q10', quote: 'Your future is created by what you do today, not tomorrow.', author: 'Robert Kiyosaki', theme: 'action' },
  { id: 'q11', quote: 'Stop doubting yourself, work hard, and make it happen.', author: 'Unknown', theme: 'confidence' },
  { id: 'q12', quote: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson', theme: 'persistence' },
  { id: 'q13', quote: 'Dreams don\'t work unless you do.', author: 'John C. Maxwell', theme: 'action' },
  { id: 'q14', quote: 'The harder you work for something, the greater you will feel when you achieve it.', author: 'Unknown', theme: 'effort' },
];

function dateSeededIndex(dateStr: string, poolSize: number): number {
  const hash = dateStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
  return hash % poolSize;
}

export class SupabaseQuotesDatasource {
  async getDailyQuote(dateStr: string): Promise<DailyQuote> {
    try {
      const supabase = await createClient();

      // 1. Check for quote explicitly assigned to today
      const { data: assigned } = await supabase
        .from('daily_quotes')
        .select('*')
        .eq('display_date', dateStr)
        .maybeSingle();

      if (assigned) return assigned as DailyQuote;

      // 2. Date-seeded selection from the pool in DB
      const { data: allQuotes } = await supabase
        .from('daily_quotes')
        .select('*')
        .order('priority', { ascending: false });

      if (allQuotes && allQuotes.length > 0) {
        const idx = dateSeededIndex(dateStr, allQuotes.length);
        return allQuotes[idx] as DailyQuote;
      }
    } catch (err) {
      logger.warn('Failed to fetch quote from DB', { dateStr, err });
    }

    // 3. Local fallback — always returns consistent quote for today
    const idx = dateSeededIndex(dateStr, QUOTE_POOL.length);
    return QUOTE_POOL[idx];
  }
}

export const supabaseQuotesDatasource = new SupabaseQuotesDatasource();
