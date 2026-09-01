export type NotificationType =
  | 'STREAK'
  | 'PRIORITY'
  | 'TIMETABLE'
  | 'PLACEMENT'
  | 'SYSTEM';

export type NotificationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export interface VOSNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: string; // ISO string
  read: boolean;
  linkUrl: string;
  tag?: string;
}
