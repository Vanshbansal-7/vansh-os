import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { DailyTask, PriorityLevel } from '@/types/dashboard';

const SEED_TASKS: Omit<DailyTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [
  { title: 'Amazon OA Deadline', subtitle: '2 Days Left', category: 'Career', priority_level: 'HIGH', completed: false, due_date: new Date().toISOString().split('T')[0], source: 'manual', is_active: true },
  { title: 'DSA Daily Goal', subtitle: '3 / 3 Questions', category: 'Study', priority_level: 'MEDIUM', completed: true, due_date: new Date().toISOString().split('T')[0], source: 'manual', is_active: true },
  { title: 'System Design', subtitle: 'Study 1 Topic', category: 'Study', priority_level: 'MEDIUM', completed: false, due_date: new Date().toISOString().split('T')[0], source: 'manual', is_active: true },
  { title: 'Core Subject Revision', subtitle: 'Complete OS Unit 4', category: 'Study', priority_level: 'MEDIUM', completed: false, due_date: new Date().toISOString().split('T')[0], source: 'manual', is_active: true },
  { title: 'Health Goal', subtitle: 'Drink 3L Water', category: 'Health', priority_level: 'LOW', completed: false, due_date: new Date().toISOString().split('T')[0], source: 'manual', is_active: true },
];

function makeSeedTasks(): DailyTask[] {
  return SEED_TASKS.map((t, idx) => ({
    ...t,
    id: `seed-task-${idx}`,
    user_id: 'anonymous',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export class SupabaseTasksDatasource {
  async getTodaysTasks(userId?: string): Promise<DailyTask[]> {
    if (!userId) return makeSeedTasks();

    const today = new Date().toISOString().split('T')[0];

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('due_date', today)
        .order('priority_level', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as DailyTask[];
      }
    } catch (err) {
      logger.warn('Failed to fetch tasks from DB, using seed', { err });
    }

    return makeSeedTasks();
  }

  async toggleTaskComplete(taskId: string, userId: string, completed: boolean): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('daily_tasks')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('user_id', userId);

      if (!error) return true;
      logger.error('Failed to toggle task', { taskId, error });
    } catch (err) {
      logger.error('Toggle task exception', { err });
    }
    return false;
  }
}

export const supabaseTasksDatasource = new SupabaseTasksDatasource();
