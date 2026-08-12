import { createClient } from '@/lib/supabase/server';

export interface NoteRecord {
  id?: string;
  user_id?: string;
  module: 'GENERAL' | 'EXAMS' | 'YOUTUBE' | 'CGL' | 'PLACEMENT';
  exam_id?: string;
  title: string;
  content?: string;
  category?: string;
  tags?: string[];
  is_pinned?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class NotesRepository {
  static async findByModule(module: string, examId?: string): Promise<NoteRecord[]> {
    const supabase = await createClient();
    let query = supabase
      .from('notes')
      .select('*')
      .eq('module', module);
      
    if (examId) {
      query = query.eq('exam_id', examId);
    }

    const { data, error } = await query
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[NotesRepository.findByModule] Supabase error:', error);
      throw new Error(`Database error fetching notes for module ${module}: ${error.message}`);
    }

    return data || [];
  }

  static async create(note: NoteRecord): Promise<NoteRecord> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notes')
      .insert({
        module: note.module,
        exam_id: note.exam_id,
        title: note.title,
        content: note.content || '',
        category: note.category || 'General',
        tags: note.tags || [],
        is_pinned: note.is_pinned || false,
      })
      .select()
      .single();

    if (error) {
      console.error('[NotesRepository.create] Supabase error:', error);
      throw new Error(`Database error creating note: ${error.message}`);
    }

    return data;
  }

  static async update(id: string, updates: Partial<NoteRecord>): Promise<NoteRecord> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[NotesRepository.update] Supabase error:', error);
      throw new Error(`Database error updating note ${id}: ${error.message}`);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (error) {
      console.error('[NotesRepository.delete] Supabase error:', error);
      throw new Error(`Database error deleting note ${id}: ${error.message}`);
    }
  }
}
