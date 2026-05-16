import type { Notification, CreateNotificationDto, UpdateNotificationDto } from '../types/notification';

const notifications = new Map<string, Notification>();

function genId(): string {
  return crypto.randomUUID();
}

export function findAll(): Notification[] {
  return Array.from(notifications.values());
}

export function findById(id: string): Notification | undefined {
  return notifications.get(id);
}

export function findByUser(userId: string): Notification[] {
  return Array.from(notifications.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function findUnread(userId: string): Notification[] {
  return findByUser(userId).filter((n) => !n.readAt);
}

export function countUnread(userId: string): number {
  return findUnread(userId).length;
}

export function create(dto: CreateNotificationDto): Notification {
  const now = new Date();
  const n: Notification = {
    id: genId(),
    userId: dto.userId,
    type: dto.type,
    title: dto.title,
    body: dto.body,
    priority: dto.priority || 'medium',
    status: 'pending',
    readAt: null,
    createdAt: now,
    updatedAt: now,
  };
  notifications.set(n.id, n);
  return n;
}

export function update(id: string, dto: UpdateNotificationDto): Notification | undefined {
  const n = notifications.get(id);
  if (!n) return undefined;

  const updated: Notification = {
    ...n,
    ...(dto.status && { status: dto.status }),
    ...(dto.readAt && { readAt: new Date(dto.readAt) }),
    updatedAt: new Date(),
  };

  if (dto.status === 'read' && !updated.readAt) {
    updated.readAt = new Date();
  }

  notifications.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return notifications.delete(id);
}

export function removeByUser(userId: string): number {
  let count = 0;
  for (const [id, n] of notifications) {
    if (n.userId === userId) {
      notifications.delete(id);
      count++;
    }
  }
  return count;
}

export function markAllRead(userId: string): number {
  const now = new Date();
  let count = 0;

  for (const [id, n] of notifications) {
    if (n.userId === userId && !n.readAt) {
      notifications.set(id, { ...n, readAt: now, status: 'read', updatedAt: now });
      count++;
    }
  }
  return count;
}
