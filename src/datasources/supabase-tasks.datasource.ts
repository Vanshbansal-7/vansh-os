import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { DailyTask } from '@/types/dashboard';

export class SupabaseTasksDatasource {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otjslotfiiubgehiucmn.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk'
    );
  }

  async getTodaysTasks(userId?: string): Promise<DailyTask[]> {
    try {
      const supabase = this.getSupabase();
      let query = supabase
        .from('daily_tasks')
        .select('*')
        .eq('is_active', true);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query
        .order('priority_level', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch tasks from DB', { error });
      }

      if (!error && data) {
        return data as DailyTask[];
      }
    } catch (err) {
      logger.error('Failed to fetch tasks from DB exception', { err });
    }

    return [];
  }

  async toggleTaskComplete(taskId: string, userId?: string, completed: boolean = true): Promise<boolean> {
    try {
      const supabase = this.getSupabase();
      let query = supabase
        .from('daily_tasks')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (!error) return true;
      logger.error('Failed to toggle task', { taskId, error });
    } catch (err) {
      logger.error('Toggle task exception', { err });
    }
    return false;
  }

  async createTask(task: Partial<DailyTask>, userId?: string): Promise<DailyTask | null> {
    try {
      const supabase = this.getSupabase();
      const newTask: any = {
        title: task.title,
        subtitle: task.subtitle || null,
        category: task.category || 'General',
        priority_level: task.priority_level || 'MEDIUM',
        completed: task.completed || false,
        completed_at: task.completed_at || null,
        deadline: task.deadline || null,
        due_date: task.due_date || new Date().toISOString().split('T')[0],
        source: task.source || 'manual',
        is_active: task.is_active !== undefined ? task.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (userId) {
        newTask.user_id = userId;
      }
      
      const { data, error } = await supabase
        .from('daily_tasks')
        .insert([newTask])
        .select()
        .single();
        
      if (error) {
        logger.error('Failed to create task', { error, newTask });
        throw new Error(error.message);
      }

      if (data) return data as DailyTask;
    } catch (err) {
      logger.error('Create task exception', { err });
      throw err;
    }
    return null;
  }

  async editTask(taskId: string, userId?: string, updates?: Partial<DailyTask>): Promise<boolean> {
    try {
      const supabase = this.getSupabase();
      let query = supabase
        .from('daily_tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (!error) return true;
      logger.error('Failed to edit task', { taskId, error });
    } catch (err) {
      logger.error('Edit task exception', { err });
    }
    return false;
  }

  async deleteTask(taskId: string, userId?: string): Promise<boolean> {
    try {
      const supabase = this.getSupabase();
      let query = supabase
        .from('daily_tasks')
        .delete()
        .eq('id', taskId);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (!error) return true;
      logger.error('Failed to delete task', { taskId, error });
    } catch (err) {
      logger.error('Delete task exception', { err });
    }
    return false;
  }
}

export const supabaseTasksDatasource = new SupabaseTasksDatasource();
