import { tasksRepository } from '@/repositories/tasks.repository';
import { supabaseTasksDatasource } from '@/datasources/supabase-tasks.datasource';
import { DailyTask, PriorityLevel } from '@/types/dashboard';

const PRIORITY_ORDER: Record<PriorityLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export class TasksService {
  async getTodaysPriorities(userId?: string): Promise<DailyTask[]> {
    const tasks = await tasksRepository.getTodaysTasks(userId);
    // Sort: incomplete first, then by priority
    return tasks.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return PRIORITY_ORDER[a.priority_level] - PRIORITY_ORDER[b.priority_level];
    });
  }

  async toggleComplete(taskId: string, userId?: string, completed: boolean = true): Promise<boolean> {
    return tasksRepository.toggleComplete(taskId, userId, completed);
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

export const tasksService = new TasksService();
