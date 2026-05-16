import * as repo from '../repository/maintenanceRepo';
import * as vehicleRepo from '../repository/vehicleRepo';
import { log } from '../utils/log';
import type { Maintenance, CreateMaintenanceDto, UpdateMaintenanceDto } from '../types/vehicle';

export function getAll(): Maintenance[] {
  log('debug', 'service', 'maintenanceSvc.getAll — fetching all records');
  const ms = repo.findAll();
  log('info', 'service', `maintenanceSvc.getAll — found ${ms.length} records`);
  return ms;
}

export function getById(id: string): Maintenance | undefined {
  log('debug', 'service', `maintenanceSvc.getById — id: ${id}`);
  const m = repo.findById(id);
  if (!m) {
    log('warn', 'service', `maintenanceSvc.getById — record not found: ${id}`);
  }
  return m;
}

export function getByVehicle(vehicleId: string): Maintenance[] {
  log('debug', 'service', `maintenanceSvc.getByVehicle — vehicleId: ${vehicleId}`);
  return repo.findByVehicle(vehicleId);
}

export function getUpcoming(days: number = 7): Maintenance[] {
  log('debug', 'service', `maintenanceSvc.getUpcoming — days: ${days}`);
  const ms = repo.findUpcoming(days);
  log('info', 'service', `maintenanceSvc.getUpcoming — found ${ms.length} upcoming records`);
  return ms;
}

export function create(dto: CreateMaintenanceDto): { ok: boolean; data?: Maintenance; err?: string } {
  log('debug', 'service', `maintenanceSvc.create — vehicleId: ${dto.vehicleId}, type: ${dto.type}`);

  const vehicle = vehicleRepo.findById(dto.vehicleId);
  if (!vehicle) {
    log('warn', 'service', `maintenanceSvc.create — vehicle not found: ${dto.vehicleId}`);
    return { ok: false, err: 'Vehicle not found' };
  }

  const scheduled = new Date(dto.scheduledAt);
  if (isNaN(scheduled.getTime())) {
    log('warn', 'service', `maintenanceSvc.create — invalid date: ${dto.scheduledAt}`);
    return { ok: false, err: 'Invalid scheduled date' };
  }

  const m = repo.create(dto);
  log('info', 'service', `maintenanceSvc.create — created record: ${m.id}, vehicle: ${dto.vehicleId}`);
  return { ok: true, data: m };
}

export function update(id: string, dto: UpdateMaintenanceDto): { ok: boolean; data?: Maintenance; err?: string } {
  log('debug', 'service', `maintenanceSvc.update — id: ${id}`);

  const m = repo.update(id, dto);
  if (!m) {
    log('warn', 'service', `maintenanceSvc.update — record not found: ${id}`);
    return { ok: false, err: 'Maintenance record not found' };
  }

  log('info', 'service', `maintenanceSvc.update — updated record: ${id}, status: ${m.status}`);
  return { ok: true, data: m };
}

export function remove(id: string): { ok: boolean; err?: string } {
  log('debug', 'service', `maintenanceSvc.remove — id: ${id}`);

  const m = repo.findById(id);
  if (!m) {
    log('warn', 'service', `maintenanceSvc.remove — record not found: ${id}`);
    return { ok: false, err: 'Maintenance record not found' };
  }

  repo.remove(id);
  log('info', 'service', `maintenanceSvc.remove — deleted record: ${id}`);
  return { ok: true };
}
