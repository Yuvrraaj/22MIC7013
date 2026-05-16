import type { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../types/vehicle';

const vehicles = new Map<string, Vehicle>();

function genId(): string {
  return crypto.randomUUID();
}

export function findAll(): Vehicle[] {
  return Array.from(vehicles.values());
}

export function findById(id: string): Vehicle | undefined {
  return vehicles.get(id);
}

export function findByPlate(plate: string): Vehicle | undefined {
  return Array.from(vehicles.values()).find((v) => v.plate === plate);
}

export function create(dto: CreateVehicleDto): Vehicle {
  const now = new Date();
  const v: Vehicle = {
    id: genId(),
    ...dto,
    createdAt: now,
    updatedAt: now,
  };
  vehicles.set(v.id, v);
  return v;
}

export function update(id: string, dto: UpdateVehicleDto): Vehicle | undefined {
  const v = vehicles.get(id);
  if (!v) return undefined;

  const updated: Vehicle = {
    ...v,
    ...dto,
    updatedAt: new Date(),
  };
  vehicles.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return vehicles.delete(id);
}
