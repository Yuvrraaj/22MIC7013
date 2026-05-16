import * as repo from '../repository/notificationRepo';
import * as userRepo from '../repository/userRepo';
import { log } from '../utils/log';
import type {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  BulkNotificationDto,
} from '../types/notification';

export function getAll(): Notification[] {
  log('debug', 'service', 'notificationSvc.getAll — fetching all notifications');
  const ns = repo.findAll();
  log('info', 'service', `notificationSvc.getAll — found ${ns.length} notifications`);
  return ns;
}

export function getById(id: string): Notification | undefined {
  log('debug', 'service', `notificationSvc.getById — id: ${id}`);
  const n = repo.findById(id);
  if (!n) {
    log('warn', 'service', `notificationSvc.getById — notification not found: ${id}`);
  }
  return n;
}

export function getByUser(userId: string): Notification[] {
  log('debug', 'service', `notificationSvc.getByUser — userId: ${userId}`);
  return repo.findByUser(userId);
}

export function getUnread(userId: string): { count: number; items: Notification[] } {
  log('debug', 'service', `notificationSvc.getUnread — userId: ${userId}`);
  const items = repo.findUnread(userId);
  return { count: items.length, items };
}

export function create(dto: CreateNotificationDto): { ok: boolean; data?: Notification; err?: string } {
  log('debug', 'service', `notificationSvc.create — userId: ${dto.userId}, type: ${dto.type}`);

  const user = userRepo.findById(dto.userId);
  if (!user) {
    log('warn', 'service', `notificationSvc.create — user not found: ${dto.userId}`);
    return { ok: false, err: 'User not found' };
  }

  const n = repo.create(dto);
  log('info', 'service', `notificationSvc.create — created notification: ${n.id}, user: ${dto.userId}`);
  return { ok: true, data: n };
}

export function createBulk(dto: BulkNotificationDto): { ok: boolean; created: number; failed: string[] } {
  log('info', 'service', `notificationSvc.createBulk — sending to ${dto.userIds.length} users`);

  const failed: string[] = [];
  let created = 0;

  for (const userId of dto.userIds) {
    const user = userRepo.findById(userId);
    if (!user) {
      failed.push(userId);
      continue;
    }

    repo.create({
      userId,
      type: dto.type,
      title: dto.title,
      body: dto.body,
      priority: dto.priority,
    });
    created++;
  }

  log('info', 'service', `notificationSvc.createBulk — created: ${created}, failed: ${failed.length}`);
  return { ok: true, created, failed };
}

export function update(id: string, dto: UpdateNotificationDto): { ok: boolean; data?: Notification; err?: string } {
  log('debug', 'service', `notificationSvc.update — id: ${id}`);

  const n = repo.update(id, dto);
  if (!n) {
    log('warn', 'service', `notificationSvc.update — notification not found: ${id}`);
    return { ok: false, err: 'Notification not found' };
  }

  log('info', 'service', `notificationSvc.update — updated notification: ${id}, status: ${n.status}`);
  return { ok: true, data: n };
}

export function markRead(id: string): { ok: boolean; data?: Notification; err?: string } {
  return update(id, { status: 'read' });
}

export function markAllRead(userId: string): { ok: boolean; count: number } {
  log('debug', 'service', `notificationSvc.markAllRead — userId: ${userId}`);
  const count = repo.markAllRead(userId);
  log('info', 'service', `notificationSvc.markAllRead — marked ${count} as read`);
  return { ok: true, count };
}

export function remove(id: string): { ok: boolean; err?: string } {
  log('debug', 'service', `notificationSvc.remove — id: ${id}`);

  const n = repo.findById(id);
  if (!n) {
    log('warn', 'service', `notificationSvc.remove — notification not found: ${id}`);
    return { ok: false, err: 'Notification not found' };
  }

  repo.remove(id);
  log('info', 'service', `notificationSvc.remove — deleted notification: ${id}`);
  return { ok: true };
}
