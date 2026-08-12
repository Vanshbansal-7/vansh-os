import { supabaseQuotesDatasource } from '@/datasources/supabase-quotes.datasource';
import { DailyQuote } from '@/types/dashboard';

export class QuotesRepository {
  async getDailyQuote(dateStr: string): Promise<DailyQuote> {
    return supabaseQuotesDatasource.getDailyQuote(dateStr);
  }
}

export const quotesRepository = new QuotesRepository();
