import type { Request, Response } from 'express';
import * as svc from '../services/maintenanceSvc';
import { log } from '../utils/log';

export function getAll(_req: Request, res: Response): void {
  log('info', 'controller', 'GET /maintenance — invoked');
  const ms = svc.getAll();
  res.json({ ok: true, data: ms });
}

export function getById(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `GET /maintenance/${id} — invoked`);

  const m = svc.getById(id);
  if (!m) {
    res.status(404).json({ ok: false, error: 'Maintenance record not found' });
    return;
  }
  res.json({ ok: true, data: m });
}

export function getByVehicle(req: Request<{ vehicleId: string }>, res: Response): void {
  const vehicleId = req.params.vehicleId;
  log('info', 'controller', `GET /vehicles/${vehicleId}/maintenance — invoked`);

  const ms = svc.getByVehicle(vehicleId);
  res.json({ ok: true, data: ms });
}

export function getUpcoming(req: Request, res: Response): void {
  const days = parseInt(req.query.days as string) || 7;
  log('info', 'controller', `GET /maintenance/upcoming — days: ${days}`);

  const ms = svc.getUpcoming(days);
  res.json({ ok: true, data: ms });
}

export function create(req: Request, res: Response): void {
  log('info', 'controller', 'POST /maintenance — invoked');

  const { vehicleId, type, desc, scheduledAt, notes } = req.body;

  if (!vehicleId || !type || !desc || !scheduledAt) {
    log('warn', 'controller', 'POST /maintenance — missing required fields');
    res.status(400).json({ ok: false, error: 'Missing required fields: vehicleId, type, desc, scheduledAt' });
    return;
  }

  const validTypes = ['oil_change', 'tire_rotation', 'brake_inspection', 'engine_tune', 'transmission', 'battery', 'other'];
  if (!validTypes.includes(type)) {
    log('warn', 'controller', `POST /maintenance — invalid type: ${type}`);
    res.status(400).json({ ok: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
    return;
  }

  const result = svc.create({ vehicleId, type, desc, scheduledAt, notes });
  if (!result.ok) {
    const status = result.err === 'Vehicle not found' ? 404 : 400;
    res.status(status).json({ ok: false, error: result.err });
    return;
  }

  log('info', 'controller', `POST /maintenance — created: ${result.data!.id}`);
  res.status(201).json({ ok: true, data: result.data });
}

export function update(req: Request<{ id: string }>, res: Response): void {
  const id = req.params.id;
  log('info', 'controller', `PUT /maintenance/${id} — invoked`);

  if (req.body.type) {
    const validTypes = ['oil_change', 'tire_rotation', 'brake_inspection', 'engine_tune', 'transmission', 'battery', 'other'];
    if (!validTypes.includes(req.body.type)) {
      res.status(400).json({ ok: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
      return;
    }
  }

  if (req.body.status) {
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(req.body.status)) {
      res.status(400).json({ ok: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
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
  log('info', 'controller', `DELETE /maintenance/${id} — invoked`);

  const result = svc.remove(id);
  if (!result.ok) {
    res.status(404).json({ ok: false, error: result.err });
    return;
  }

  res.status(204).send();
}
