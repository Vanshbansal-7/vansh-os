import { tasksRepository } from '@/repositories/tasks.repository';
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

  async toggleComplete(taskId: string, userId: string, completed: boolean): Promise<boolean> {
    return tasksRepository.toggleComplete(taskId, userId, completed);
  }
}

export const tasksService = new TasksService();
