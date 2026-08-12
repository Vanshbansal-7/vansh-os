'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { CGLResource } from '@/types/cgl';

const fetcher = async (url: string): Promise<any[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || 'Failed to fetch CGL resources from database');
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Database query failed');
  return json.data;
};

export function useExamResources(moduleSlug: string, examId?: string) {
  const queryParam = examId 
    ? `?module=${moduleSlug.toUpperCase()}&exam_id=${examId}`
    : `?module=${moduleSlug.toUpperCase()}`;

  const { data, isLoading, error: swrError, mutate } = useSWR<any[]>(
    `/api/v1/resources${queryParam}`,
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 5_000 }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const resources = useMemo<CGLResource[]>(() => {
    let list = (data || []).map((r: any) => ({
      id: r.id,
      title: r.title || 'Untitled Resource',
      type: (r.type || 'website').toLowerCase() as any,
      metadata: r.metadata || r.description || r.category || 'Resource',
      tags: Array.isArray(r.tags) ? r.tags : [r.category || 'General'],
      priority: (r.priority || 'MEDIUM').toUpperCase() as any,
      url: r.url || '#',
      display_url: r.display_url || (r.url || '#').replace(/^https?:\/\//, '').split('/')[0],
      added_date: r.added_date || `Added on ${new Date(r.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      category: r.category || 'General',
    }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.url.toLowerCase().includes(q) ||
        r.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== 'All') {
      list = list.filter(r => r.category === selectedCategory || r.tags.includes(selectedCategory));
    }
    if (selectedType !== 'All') {
      list = list.filter(r => r.type === selectedType);
    }
    if (selectedTag !== 'All') {
      list = list.filter(r => r.tags.includes(selectedTag));
    }
    if (selectedPriority !== 'All') {
      list = list.filter(r => r.priority === selectedPriority);
    }
    return list;
  }, [data, searchQuery, selectedCategory, selectedType, selectedTag, selectedPriority]);

  const categoriesCount = useMemo(() => [
    { label: 'All Resources', count: resources.length, active: true },
    { label: 'YouTube', count: resources.filter(r => r.type === 'youtube').length, icon: 'youtube' },
    { label: 'Documents', count: resources.filter(r => r.type === 'document').length, icon: 'file-text' },
    { label: 'Websites', count: resources.filter(r => r.type === 'website').length, icon: 'globe' },
    { label: 'Mock Tests', count: resources.filter(r => r.type === 'mock_test').length, icon: 'target' },
    { label: 'Books', count: resources.filter(r => r.type === 'book').length, icon: 'book' },
    { label: 'Telegram', count: resources.filter(r => r.type === 'telegram').length, icon: 'send' },
  ], [resources]);

  const summaryStats = useMemo(() => [
    { label: 'Total Resources', count: resources.length, color: 'text-white' },
    { label: 'High Priority', count: resources.filter(r => r.priority === 'HIGH').length, color: 'text-rose-400' },
    { label: 'Medium Priority', count: resources.filter(r => r.priority === 'MEDIUM').length, color: 'text-amber-400' },
    { label: 'Low Priority', count: resources.filter(r => r.priority === 'LOW').length, color: 'text-emerald-400' },
  ], [resources]);

  const addResource = async (resData: any) => {
    const payload = {
      ...resData,
      module: moduleSlug.toUpperCase(),
      exam_id: examId,
      priority: (resData.priority || 'MEDIUM').toUpperCase(),
    };
    const res = await fetch('/api/v1/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || 'Failed to insert CGL resource into database');
    }
    await mutate();
    return json.data;
  };

  const deleteResource = async (id: string) => {
    const res = await fetch(`/api/v1/resources/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || 'Failed to delete CGL resource from database');
    }
    await mutate();
  };

  return {
    resources,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedTag,
    setSelectedTag,
    selectedPriority,
    setSelectedPriority,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    categoriesCount,
    summaryStats,
    addResource,
    deleteResource,
    isLoading: isLoading && !data,
    swrError,
    mutate,
  };
}
