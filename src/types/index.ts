export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'not_started' | 'in_progress' | 'completed' | 'blocked';
export type ModuleType = 'mission' | 'career' | 'learning' | 'life' | 'system';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerCompany extends BaseEntity {
  name: string;
  role: string;
  status: 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  appliedDate?: string;
  notes?: string;
  url?: string;
}

export interface LearningTopic extends BaseEntity {
  title: string;
  category: 'dsa' | 'core' | 'system_design' | 'framework';
  status: Status;
  difficulty: 'easy' | 'medium' | 'hard';
  lastRevised?: string;
  nextRevision?: string;
}

export interface LifeHealthMetric extends BaseEntity {
  date: string;
  calories: number;
  waterIntake: number; // in ml
  weight?: number;
  sleepHours: number;
}

export interface Habit extends BaseEntity {
  title: string;
  streak: number;
  completedToday: boolean;
  frequency: 'daily' | 'weekly';
}
