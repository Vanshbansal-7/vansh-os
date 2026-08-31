import { supabaseTasksDatasource } from '@/datasources/supabase-tasks.datasource';
import { DailyTask } from '@/types/dashboard';

export class TasksRepository {
  async getTodaysTasks(userId?: string): Promise<DailyTask[]> {
    return supabaseTasksDatasource.getTodaysTasks(userId);
  }

  async toggleComplete(taskId: string, userId?: string, completed: boolean = true): Promise<boolean> {
    return supabaseTasksDatasource.toggleTaskComplete(taskId, userId, completed);
  }

  async createTask(task: Partial<DailyTask>, userId?: string): Promise<DailyTask | null> {
    return supabaseTasksDatasource.createTask(task, userId);
  }

  async editTask(taskId: string, userId?: string, updates?: Partial<DailyTask>): Promise<boolean> {
    return supabaseTasksDatasource.editTask(taskId, userId, updates);
  }

  async deleteTask(taskId: string, userId?: string): Promise<boolean> {
    return supabaseTasksDatasource.deleteTask(taskId, userId);
  }
}

export const tasksRepository = new TasksRepository();
