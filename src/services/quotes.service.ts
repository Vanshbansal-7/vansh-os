import { quotesRepository } from '@/repositories/quotes.repository';
import { DailyQuote } from '@/types/dashboard';

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export class QuotesService {
  getISTDateStr(): string {
    return new Date(Date.now() + IST_OFFSET_MS).toISOString().split('T')[0];
  }

  async getDailyQuote(): Promise<DailyQuote> {
    const dateStr = this.getISTDateStr();
    return quotesRepository.getDailyQuote(dateStr);
  }
}

export const quotesService = new QuotesService();
