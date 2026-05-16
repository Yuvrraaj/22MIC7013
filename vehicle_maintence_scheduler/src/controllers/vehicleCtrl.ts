import type { Request, Response } from 'express';
import * as svc from '../services/vehicleSvc';
import { log } from '../utils/log';

export function getAll(_req: Request, res: Response): void {
  log('info', 'controller', 'GET /vehicles — invoked');
  const vs = svc.getAll();
  res.json({ ok: true, data: vs });
}

export function getById(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `GET /vehicles/${id} — invoked`);

  const v = svc.getById(id);
  if (!v) {
    res.status(404).json({ ok: false, error: 'Vehicle not found' });
    return;
  }
  res.json({ ok: true, data: v });
}

export function create(req: Request, res: Response): void {
  log('info', 'controller', 'POST /vehicles — invoked');

  const { make, model, year, plate, ownerId } = req.body;

  if (!make || !model || !year || !plate || !ownerId) {
    log('warn', 'controller', 'POST /vehicles — missing required fields');
    res.status(400).json({ ok: false, error: 'Missing required fields: make, model, year, plate, ownerId' });
    return;
  }

  const result = svc.create({ make, model, year, plate, ownerId });
  if (!result.ok) {
    res.status(400).json({ ok: false, error: result.err });
    return;
  }

  log('info', 'controller', `POST /vehicles — created: ${result.data!.id}`);
  res.status(201).json({ ok: true, data: result.data });
}

export function update(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `PUT /vehicles/${id} — invoked`);

  const result = svc.update(id, req.body);
  if (!result.ok) {
    const status = result.err === 'Vehicle not found' ? 404 : 400;
    res.status(status).json({ ok: false, error: result.err });
    return;
  }

  res.json({ ok: true, data: result.data });
}

export function remove(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `DELETE /vehicles/${id} — invoked`);

  const result = svc.remove(id);
  if (!result.ok) {
    res.status(404).json({ ok: false, error: result.err });
    return;
  }

  res.status(204).send();
}
