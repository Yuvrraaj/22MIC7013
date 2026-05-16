import * as repo from '../repository/vehicleRepo';
import * as maintRepo from '../repository/maintenanceRepo';
import { log } from '../utils/log';
import type { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../types/vehicle';

export function getAll(): Vehicle[] {
  log('debug', 'service', 'vehicleSvc.getAll — fetching all vehicles');
  const vs = repo.findAll();
  log('info', 'service', `vehicleSvc.getAll — found ${vs.length} vehicles`);
  return vs;
}

export function getById(id: string): Vehicle | undefined {
  log('debug', 'service', `vehicleSvc.getById — id: ${id}`);
  const v = repo.findById(id);
  if (!v) {
    log('warn', 'service', `vehicleSvc.getById — vehicle not found: ${id}`);
  }
  return v;
}

export function create(dto: CreateVehicleDto): { ok: boolean; data?: Vehicle; err?: string } {
  log('debug', 'service', `vehicleSvc.create — plate: ${dto.plate}`);

  const existing = repo.findByPlate(dto.plate);
  if (existing) {
    log('warn', 'service', `vehicleSvc.create — duplicate plate: ${dto.plate}`);
    return { ok: false, err: 'Vehicle with this plate already exists' };
  }

  const v = repo.create(dto);
  log('info', 'service', `vehicleSvc.create — created vehicle: ${v.id}, plate: ${v.plate}`);
  return { ok: true, data: v };
}

export function update(id: string, dto: UpdateVehicleDto): { ok: boolean; data?: Vehicle; err?: string } {
  log('debug', 'service', `vehicleSvc.update — id: ${id}`);

  if (dto.plate) {
    const existing = repo.findByPlate(dto.plate);
    if (existing && existing.id !== id) {
      log('warn', 'service', `vehicleSvc.update — duplicate plate: ${dto.plate}`);
      return { ok: false, err: 'Another vehicle has this plate' };
    }
  }

  const v = repo.update(id, dto);
  if (!v) {
    log('warn', 'service', `vehicleSvc.update — vehicle not found: ${id}`);
    return { ok: false, err: 'Vehicle not found' };
  }

  log('info', 'service', `vehicleSvc.update — updated vehicle: ${id}`);
  return { ok: true, data: v };
}

export function remove(id: string): { ok: boolean; err?: string } {
  log('debug', 'service', `vehicleSvc.remove — id: ${id}`);

  const v = repo.findById(id);
  if (!v) {
    log('warn', 'service', `vehicleSvc.remove — vehicle not found: ${id}`);
    return { ok: false, err: 'Vehicle not found' };
  }

  const maintCount = maintRepo.removeByVehicle(id);
  log('debug', 'service', `vehicleSvc.remove — deleted ${maintCount} maintenance records`);

  repo.remove(id);
  log('info', 'service', `vehicleSvc.remove — deleted vehicle: ${id}, plate: ${v.plate}`);
  return { ok: true };
}
