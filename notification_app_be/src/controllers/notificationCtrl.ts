import type { Request, Response } from 'express';
import * as svc from '../services/notificationSvc';
import { log } from '../utils/log';

const VALID_TYPES = ['info', 'warning', 'alert', 'promo', 'system'];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_STATUSES = ['pending', 'sent', 'delivered', 'read', 'failed'];

export function getAll(_req: Request, res: Response): void {
  log('info', 'controller', 'GET /notifications — invoked');
  const ns = svc.getAll();
  res.json({ ok: true, data: ns });
}

export function getById(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `GET /notifications/${id} — invoked`);

  const n = svc.getById(id);
  if (!n) {
    res.status(404).json({ ok: false, error: 'Notification not found' });
    return;
  }
  res.json({ ok: true, data: n });
}

export function getByUser(req: Request<{ userId: string }>, res: Response): void {
  const userId = req.params.userId;
  log('info', 'controller', `GET /users/${userId}/notifications — invoked`);

  const ns = svc.getByUser(userId);
  res.json({ ok: true, data: ns });
}

export function getUnread(req: Request<{ userId: string }>, res: Response): void {
  const userId = req.params.userId;
  log('info', 'controller', `GET /users/${userId}/notifications/unread — invoked`);

  const result = svc.getUnread(userId);
  res.json({ ok: true, ...result });
}

export function create(req: Request, res: Response): void {
  log('info', 'controller', 'POST /notifications — invoked');

  const { userId, type, title, body, priority } = req.body;

  if (!userId || !type || !title || !body) {
    log('warn', 'controller', 'POST /notifications — missing required fields');
    res.status(400).json({ ok: false, error: 'Missing required fields: userId, type, title, body' });
    return;
  }

  if (!VALID_TYPES.includes(type)) {
    res.status(400).json({ ok: false, error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` });
    return;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ ok: false, error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` });
    return;
  }

  const result = svc.create({ userId, type, title, body, priority });
  if (!result.ok) {
    const status = result.err === 'User not found' ? 404 : 400;
    res.status(status).json({ ok: false, error: result.err });
    return;
  }

  log('info', 'controller', `POST /notifications — created: ${result.data!.id}`);
  res.status(201).json({ ok: true, data: result.data });
}

export function createBulk(req: Request, res: Response): void {
  log('info', 'controller', 'POST /notifications/bulk — invoked');

  const { userIds, type, title, body, priority } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    res.status(400).json({ ok: false, error: 'userIds must be a non-empty array' });
    return;
  }

  if (!type || !title || !body) {
    res.status(400).json({ ok: false, error: 'Missing required fields: type, title, body' });
    return;
  }

  if (!VALID_TYPES.includes(type)) {
    res.status(400).json({ ok: false, error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` });
    return;
  }

  const result = svc.createBulk({ userIds, type, title, body, priority });
  res.status(201).json({ ok: result.ok, created: result.created, failed: result.failed });
}

export function update(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `PUT /notifications/${id} — invoked`);

  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    res.status(400).json({ ok: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    return;
  }

  const result = svc.update(id, req.body);
  if (!result.ok) {
    res.status(404).json({ ok: false, error: result.err });
    return;
  }

  res.json({ ok: true, data: result.data });
}

export function markRead(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `POST /notifications/${id}/read — invoked`);

  const result = svc.markRead(id);
  if (!result.ok) {
    res.status(404).json({ ok: false, error: result.err });
    return;
  }

  res.json({ ok: true, data: result.data });
}

export function markAllRead(req: Request<{ userId: string }>, res: Response): void {
  const userId = req.params.userId;
  log('info', 'controller', `POST /users/${userId}/notifications/read-all — invoked`);

  const result = svc.markAllRead(userId);
  res.json({ ok: true, count: result.count });
}

export function remove(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `DELETE /notifications/${id} — invoked`);

  const result = svc.remove(id);
  if (!result.ok) {
    res.status(404).json({ ok: false, error: result.err });
    return;
  }

  res.status(204).send();
}
