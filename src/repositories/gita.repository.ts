import { SupabaseGitaDatasource, supabaseGitaDatasource } from '@/datasources/supabase-gita.datasource';
import { GitaVerse, DailyGitaVerseResponse } from '@/types/gita';

export interface IGitaRepository {
  getDailyVerse(dateStr: string): Promise<DailyGitaVerseResponse>;
  getAllVerses(): Promise<GitaVerse[]>;
}

export class GitaRepository implements IGitaRepository {
  constructor(private datasource: SupabaseGitaDatasource = supabaseGitaDatasource) {}

  async getDailyVerse(dateStr: string): Promise<DailyGitaVerseResponse> {
    const { verse, isDailyRotation } = await this.datasource.getDailyVerseByDate(dateStr);
    return {
      date: dateStr,
      verse,
      is_daily_rotation: isDailyRotation,
      cached_at: new Date().toISOString(),
    };
  }

  async getAllVerses(): Promise<GitaVerse[]> {
    return this.datasource.getAllVerses();
  }
}

export const gitaRepository = new GitaRepository();
