export interface ExamMaster {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  category: 'Defense' | 'SSC' | 'Banking' | 'UPSC' | 'State PCS';
  conducting_body: string;
  logo_icon: string;
  description: string;
  official_website: string;
  prep_progress: number;
  is_active: boolean;
  last_updated?: string;
  upcoming_date?: string;
}

export interface ExamApplication {
  id: string;
  user_id?: string;
  exam_id: string;
  exam_name: string;
  exam_slug: string;
  status: 'Submitted' | 'Admit Card Out' | 'Result Awaited' | 'Passed' | 'In Progress';
  app_number?: string;
  submitted_date: string;
  exam_date: string;
  admit_card_status: 'Released' | 'Pending' | 'Downloaded';
  current_stage: string;
  notes?: string;
}

export interface ExamOverviewData {
  id: string;
  exam_id: string;
  introduction: string;
  notification_cycle: string;
  eligibility_nationality: string;
  eligibility_age: string;
  eligibility_qualification: string;
  selection_process: { stage: string; title: string; description: string }[];
  exam_pattern: { subject: string; questions: number; marks: number; duration: string }[];
  physical_standards?: string;
  medical_standards?: string;
  ssb_info?: string;
  salary_pay_scale: string;
  career_growth: string;
  previous_year_cutoffs: { year: string; exam_stage: string; cutoff_marks: string }[];
  important_links: { title: string; url: string }[];
}

export interface ExamTopic {
  id: string;
  subject_id: string;
  code: string;
  title: string;
  order_index: number;
  is_learned: boolean;
  is_practiced: boolean;
  is_revised: boolean;
  is_mastered: boolean;
  completed_milestones?: number;
  progress?: number;
}

export interface ExamSubject {
  id: string;
  exam_id: string;
  order_num: number;
  title: string;
  icon_name: string;
  color: string;
  total_topics: number;
  completed_topics: number;
  progress: number;
  topics: ExamTopic[];
}

export interface ExamResource {
  id: string;
  exam_id: string;
  title: string;
  url: string;
  display_url: string;
  type: 'youtube' | 'website' | 'document' | 'telegram' | 'mock_test';
  category: string;
  tags: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  metadata: string;
  added_date: string;
}

export interface ExamNote {
  id: string;
  exam_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_pinned: boolean;
  updated_at: string;
}

export type ExamTabId = 'overview' | 'resources' | 'notes' | 'tracker';
export type ExamMilestone = 'is_learned' | 'is_practiced' | 'is_revised' | 'is_mastered';
