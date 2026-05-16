import type { Request, Response } from 'express';
import * as svc from '../services/preferenceSvc';
import { log } from '../utils/log';

const VALID_CHANNELS = ['email', 'sms', 'push', 'in_app'];
const VALID_TYPES = ['info', 'warning', 'alert', 'promo', 'system'];

export function getByUser(req: Request<{ userId: string }>, res: Response): void {
  const userId = req.params.userId;
  log('info', 'controller', `GET /users/${userId}/preferences — invoked`);

  const ps = svc.getByUser(userId);
  res.json({ ok: true, data: ps });
}

export function create(req: Request, res: Response): void {
  log('info', 'controller', 'POST /preferences — invoked');

  const { userId, channel, enabled, types } = req.body;

  if (!userId || !channel || enabled === undefined || !types) {
    log('warn', 'controller', 'POST /preferences — missing required fields');
    res.status(400).json({ ok: false, error: 'Missing required fields: userId, channel, enabled, types' });
    return;
  }

  if (!VALID_CHANNELS.includes(channel)) {
    res.status(400).json({ ok: false, error: `Invalid channel. Must be one of: ${VALID_CHANNELS.join(', ')}` });
    return;
  }

  if (!Array.isArray(types) || !types.every((t: string) => VALID_TYPES.includes(t))) {
    res.status(400).json({ ok: false, error: `Invalid types. Each must be one of: ${VALID_TYPES.join(', ')}` });
    return;
  }

  const result = svc.create({ userId, channel, enabled, types });
  if (!result.ok) {
    const status = result.err === 'User not found' ? 404 : 400;
    res.status(status).json({ ok: false, error: result.err });
    return;
  }

  log('info', 'controller', `POST /preferences — created: ${result.data!.id}`);
  res.status(201).json({ ok: true, data: result.data });
}

export function update(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `PUT /preferences/${id} — invoked`);

  if (req.body.types) {
    if (!Array.isArray(req.body.types) || !req.body.types.every((t: string) => VALID_TYPES.includes(t))) {
      res.status(400).json({ ok: false, error: `Invalid types. Each must be one of: ${VALID_TYPES.join(', ')}` });
      return;
    }
  }

  const result = svc.update(id, req.body);
  if (!result.ok) {
    res.status(404).json({ ok: false, error: result.err });
    return;
  }

  res.json({ ok: true, data: result.data });
}

export function remove(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `DELETE /preferences/${id} — invoked`);

  const result = svc.remove(id);
  if (!result.ok) {
    res.status(404).json({ ok: false, error: result.err });
    return;
  }

  res.status(204).send();
}
