import { GitaRepository, gitaRepository } from '@/repositories/gita.repository';
import { DailyGitaVerseResponse, GitaVerse } from '@/types/gita';
import { format } from 'date-fns';

export class GitaService {
  constructor(private repo: GitaRepository = gitaRepository) {}

  async getTodayVerse(customDate?: string): Promise<DailyGitaVerseResponse> {
    const targetDate = customDate || format(new Date(), 'yyyy-MM-dd');
    return this.repo.getDailyVerse(targetDate);
  }

  async getAllVerses(): Promise<GitaVerse[]> {
    return this.repo.getAllVerses();
  }
}

export const gitaService = new GitaService();
