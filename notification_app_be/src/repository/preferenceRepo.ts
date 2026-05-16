import type { Preference, CreatePreferenceDto, UpdatePreferenceDto } from '../types/notification';

const prefs = new Map<string, Preference>();

function genId(): string {
  return crypto.randomUUID();
}

export function findAll(): Preference[] {
  return Array.from(prefs.values());
}

export function findById(id: string): Preference | undefined {
  return prefs.get(id);
}

export function findByUser(userId: string): Preference[] {
  return Array.from(prefs.values()).filter((p) => p.userId === userId);
}

export function findByUserAndChannel(userId: string, channel: string): Preference | undefined {
  return Array.from(prefs.values()).find(
    (p) => p.userId === userId && p.channel === channel
  );
}

export function create(dto: CreatePreferenceDto): Preference {
  const p: Preference = {
    id: genId(),
    userId: dto.userId,
    channel: dto.channel,
    enabled: dto.enabled,
    types: dto.types,
    updatedAt: new Date(),
  };
  prefs.set(p.id, p);
  return p;
}

export function update(id: string, dto: UpdatePreferenceDto): Preference | undefined {
  const p = prefs.get(id);
  if (!p) return undefined;

  const updated: Preference = {
    ...p,
    ...(dto.enabled !== undefined && { enabled: dto.enabled }),
    ...(dto.types && { types: dto.types }),
    updatedAt: new Date(),
  };
  prefs.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return prefs.delete(id);
}

export function removeByUser(userId: string): number {
  let count = 0;
  for (const [id, p] of prefs) {
    if (p.userId === userId) {
      prefs.delete(id);
      count++;
    }
  }
  return count;
}
