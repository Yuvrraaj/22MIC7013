import type { Request, Response } from 'express';
import * as svc from '../services/userSvc';
import { log } from '../utils/log';

export function getAll(_req: Request, res: Response): void {
  log('info', 'controller', 'GET /users — invoked');
  const us = svc.getAll();
  res.json({ ok: true, data: us });
}

export function getById(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `GET /users/${id} — invoked`);

  const u = svc.getById(id);
  if (!u) {
    res.status(404).json({ ok: false, error: 'User not found' });
    return;
  }
  res.json({ ok: true, data: u });
}

export function create(req: Request, res: Response): void {
  log('info', 'controller', 'POST /users — invoked');

  const { email, name } = req.body;

  if (!email || !name) {
    log('warn', 'controller', 'POST /users — missing required fields');
    res.status(400).json({ ok: false, error: 'Missing required fields: email, name' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ ok: false, error: 'Invalid email format' });
    return;
  }

  const result = svc.create({ email, name });
  if (!result.ok) {
    res.status(400).json({ ok: false, error: result.err });
    return;
  }

  log('info', 'controller', `POST /users — created: ${result.data!.id}`);
  res.status(201).json({ ok: true, data: result.data });
}

export function remove(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `DELETE /users/${id} — invoked`);

  const result = svc.remove(id);
  if (!result.ok) {
    res.status(404).json({ ok: false, error: result.err });
    return;
  }

  res.status(204).send();
}
