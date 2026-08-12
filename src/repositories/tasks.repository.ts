import { supabaseTasksDatasource } from '@/datasources/supabase-tasks.datasource';
import { DailyTask } from '@/types/dashboard';

export class TasksRepository {
  async getTodaysTasks(userId?: string): Promise<DailyTask[]> {
    return supabaseTasksDatasource.getTodaysTasks(userId);
  }

  async toggleComplete(taskId: string, userId: string, completed: boolean): Promise<boolean> {
    return supabaseTasksDatasource.toggleTaskComplete(taskId, userId, completed);
  }
}

export const tasksRepository = new TasksRepository();
