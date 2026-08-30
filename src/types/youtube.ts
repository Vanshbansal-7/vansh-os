export interface YouTubeChannelProfile {
  id: string;
  name: string;
  channel_name?: string;
  handle: string;
  channel_handle?: string;
  is_verified?: boolean;
  avatar_url?: string;
  cover_banner_url?: string;
  bio?: string;
  created_date?: string;
  category: string;
  niche?: string;
  country?: string;
  language?: string;
  channel_type?: string;
  channel_url: string;
  business_email?: string;
  default_uploads_visibility?: string;
  subscribers: string;
  total_videos: number;
  total_views?: string;
  watch_time_hrs?: string;
  first_video_date?: string;
  top_country?: string;
  important_links?: { name: string; icon: string; url: string }[];
  recent_videos?: { id: string; title: string; thumbnail_url: string; duration: string; views: string; upload_date: string }[];
  description: string;
  content_focus_tags: string[];
  upload_frequency: string | { title: string; subtitle: string };
}

export interface VaultAsset {
  id: string;
  name: string;
  category: string;
  tags: string[];
  preview_url?: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'script' | 'preset';
  size: string;
  date_added: string;
  is_favorite: boolean;
  description?: string;
}

export interface YouTubeResource {
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
}

export interface YouTubeNote {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_pinned: boolean;
  updated_at: string;
}

export type YouTubeTabId = 'overview' | 'vault' | 'resources' | 'notes' | 'tracker';
