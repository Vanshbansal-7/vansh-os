export type TimetableStatus = 'upcoming' | 'in_progress' | 'completed' | 'skipped';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TimetableEntry {
  id: string;
  user_id: string;
  title: string;
  category: string;
  start_time: string; // "HH:MM"
  end_time: string;   // "HH:MM"
  priority: PriorityLevel;
  status: TimetableStatus;
  recurring: boolean;
  day_of_week: number[];
  is_active: boolean;
  color_tag: string;
  elapsed?: string;    // calculated client-side e.g. "01:23:45"
  window?: string;     // formatted "08:00 – 09:30"
}

export interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  subtitle?: string;
  category: string;
  priority_level: PriorityLevel;
  completed: boolean;
  completed_at?: string;
  deadline?: string;
  due_date: string;
  due_time?: string;
  source: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_checkin_date: string | null;
  monthly_streak: number;
  yearly_streak: number;
  weekly_pattern: WeekDay[];
  checked_in_today: boolean;
}

export interface WeekDay {
  day: string;       // "M", "T", "W", etc.
  date: string;      // ISO date
  status: 'completed' | 'active' | 'pending' | 'future';
}

export interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  theme?: string;
  display_date?: string;
}

export interface DashboardSummary {
  greeting: string;         // "Good Morning"
  user_name: string;        // "Vansh"
  current_date_formatted: string; // "Monday, August 4, 2026"
  timezone: string;         // "Asia/Kolkata"
}

export interface CheckinResult {
  success: boolean;
  streak: StreakData;
  is_first_checkin_today: boolean;
}
