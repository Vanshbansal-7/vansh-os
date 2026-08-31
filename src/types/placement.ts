export type PlacementMilestone = 'is_learned' | 'is_practiced' | 'is_revised' | 'is_mastered';

export interface PlacementTopic {
  id: string;
  subject_id: string;
  code: string;
  title: string;
  module_name: string; // The folder/module name, e.g. "Module 01: Print Star Pattern"
  duration?: string; // Video duration string, e.g. "15:44"
  notes?: string;
  order_index: number;
  is_learned: boolean;
  is_practiced: boolean;
  is_revised: boolean;
  is_mastered: boolean;
  completed_milestones: number;
  total_milestones: 4;
  progress: number; // 0 | 25 | 50 | 75 | 100
}

export interface PlacementModuleGroup {
  name: string;
  topics: PlacementTopic[];
  total_topics: number;
  completed_topics: number;
  progress: number;
}

export interface PlacementSubject {
  id: string;
  order_num: number;
  title: string;
  icon_name: string;
  color: string;
  total_topics: number;
  completed_topics: number;
  progress: number;
  topics: PlacementTopic[];
  modules?: PlacementModuleGroup[];
}

export interface PlacementResource {
  id: string;
  title: string;
  url: string;
  display_url: string;
  type: 'youtube' | 'website' | 'document' | 'telegram' | 'mock_test';
  category: string;
  tags: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  metadata: string;
  added_date: string;
  is_pinned?: boolean;
}

export type PlacementTabId = 'tracker' | 'resources';

