'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { CGLNote } from '@/types/cgl';

const fetcher = async (url: string): Promise<CGLNote[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || 'Failed to fetch CGL notes from database');
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Database query failed');
  return json.data;
};

export function useExamNotes(moduleSlug: string, examId?: string) {
  const queryParam = examId 
    ? `?module=${moduleSlug.toUpperCase()}&exam_id=${examId}`
    : `?module=${moduleSlug.toUpperCase()}`;

  const { data, isLoading, error: swrError, mutate } = useSWR<CGLNote[]>(
    `/api/v1/notes${queryParam}`,
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 5_000 }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Last Updated');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const notes = (data || []).map((n: any) => ({
    ...n,
    folder: n.folder || n.category || 'General',
    updated_date: n.updated_date || n.updated_at || 'Today',
    word_count: n.word_count || (n.content ? n.content.split(/\s+/).length : 0),
  }));

  const foldersCount = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) => {
      counts[n.folder] = (counts[n.folder] || 0) + 1;
    });
    return [
      { label: 'All Notes', count: notes.length, color: 'text-purple-400' },
      { label: 'Strategy & Planning', count: counts['Strategy & Planning'] || 0, color: 'text-amber-400' },
      { label: 'Reasoning', count: counts['Reasoning'] || 0, color: 'text-purple-400' },
      { label: 'Maths', count: counts['Maths'] || 0, color: 'text-blue-400' },
      { label: 'English', count: counts['English'] || 0, color: 'text-emerald-400' },
      { label: 'GK & Current Affairs', count: counts['GK & Current Affairs'] || 0, color: 'text-orange-400' },
      { label: 'Mock Tests', count: counts['Mock Tests'] || 0, color: 'text-rose-400' },
      { label: 'Archived Notes', count: counts['Archived Notes'] || 0, color: 'text-slate-400' },
    ];
  }, [notes]);

  const notesStats = useMemo(() => {
    const totalWords = notes.reduce((acc, n) => acc + (n.word_count || 0), 0);
    const pinnedCount = notes.filter((n) => n.is_pinned).length;
    return [
      { label: 'Total Notes', value: String(notes.length) },
      { label: 'Pinned Notes', value: String(pinnedCount) },
      { label: 'Total Words', value: totalWords.toLocaleString() },
      { label: 'Yesterday', value: '0' },
      { label: 'This Week', value: '0' },
      { label: 'This Month', value: String(notes.length) },
    ];
  }, [notes]);

  const addNote = async (noteData: any) => {
    const payload = {
      ...noteData,
      module: moduleSlug.toUpperCase(),
      exam_id: examId,
      category: noteData.folder || noteData.category || 'General',
    };
    const res = await fetch('/api/v1/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || 'Failed to insert CGL note into database');
    }
    await mutate();
    return json.data;
  };

  const deleteNote = async (id: string) => {
    const res = await fetch(`/api/v1/notes?id=${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || 'Failed to delete CGL note from database');
    }
    await mutate();
  };

  const togglePin = async (id: string) => {
    const targetNote = notes.find((n) => n.id === id);
    const newPinState = targetNote ? !targetNote.is_pinned : true;

    const res = await fetch('/api/v1/notes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_pinned: newPinState }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || 'Failed to update pin state in database');
    }
    await mutate();
  };

  return {
    notes,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    setSelectedFolder,
    selectedTag,
    setSelectedTag,
    selectedType,
    setSelectedType,
    selectedSort,
    setSelectedSort,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    foldersCount,
    notesStats,
    addNote,
    deleteNote,
    togglePin,
    isLoading: isLoading && !data,
    swrError,
    mutate,
  };
}
