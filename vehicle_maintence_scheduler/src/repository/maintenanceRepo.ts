import type { Maintenance, CreateMaintenanceDto, UpdateMaintenanceDto } from '../types/vehicle';

const records = new Map<string, Maintenance>();

function genId(): string {
  return crypto.randomUUID();
}

export function findAll(): Maintenance[] {
  return Array.from(records.values());
}

export function findById(id: string): Maintenance | undefined {
  return records.get(id);
}

export function findByVehicle(vehicleId: string): Maintenance[] {
  return Array.from(records.values()).filter((m) => m.vehicleId === vehicleId);
}

export function findUpcoming(days: number = 7): Maintenance[] {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return Array.from(records.values()).filter(
    (m) => m.status === 'scheduled' && m.scheduledAt >= now && m.scheduledAt <= future
  );
}

export function create(dto: CreateMaintenanceDto): Maintenance {
  const now = new Date();
  const m: Maintenance = {
    id: genId(),
    vehicleId: dto.vehicleId,
    type: dto.type,
    desc: dto.desc,
    scheduledAt: new Date(dto.scheduledAt),
    completedAt: null,
    cost: null,
    notes: dto.notes || '',
    status: 'scheduled',
    createdAt: now,
    updatedAt: now,
  };
  records.set(m.id, m);
  return m;
}

export function update(id: string, dto: UpdateMaintenanceDto): Maintenance | undefined {
  const m = records.get(id);
  if (!m) return undefined;

  const updated: Maintenance = {
    ...m,
    ...(dto.type && { type: dto.type }),
    ...(dto.desc && { desc: dto.desc }),
    ...(dto.scheduledAt && { scheduledAt: new Date(dto.scheduledAt) }),
    ...(dto.completedAt && { completedAt: new Date(dto.completedAt) }),
    ...(dto.cost !== undefined && { cost: dto.cost }),
    ...(dto.notes !== undefined && { notes: dto.notes }),
    ...(dto.status && { status: dto.status }),
    updatedAt: new Date(),
  };
  records.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return records.delete(id);
}

export function removeByVehicle(vehicleId: string): number {
  let count = 0;
  for (const [id, m] of records) {
    if (m.vehicleId === vehicleId) {
      records.delete(id);
      count++;
    }
  }
  return count;
}
