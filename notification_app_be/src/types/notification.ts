export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: Priority;
  status: NotificationStatus;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType = 'info' | 'warning' | 'alert' | 'promo' | 'system';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Preference {
  id: string;
  userId: string;
  channel: Channel;
  enabled: boolean;
  types: NotificationType[];
  updatedAt: Date;
}

export type Channel = 'email' | 'sms' | 'push' | 'in_app';

export interface CreateUserDto {
  email: string;
  name: string;
}

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  priority?: Priority;
}

export interface UpdateNotificationDto {
  status?: NotificationStatus;
  readAt?: string;
}

export interface CreatePreferenceDto {
  userId: string;
  channel: Channel;
  enabled: boolean;
  types: NotificationType[];
}

export interface UpdatePreferenceDto {
  enabled?: boolean;
  types?: NotificationType[];
}

export interface BulkNotificationDto {
  userIds: string[];
  type: NotificationType;
  title: string;
  body: string;
  priority?: Priority;
}
