import * as repo from '../repository/preferenceRepo';
import * as userRepo from '../repository/userRepo';
import { log } from '../utils/log';
import type { Preference, CreatePreferenceDto, UpdatePreferenceDto } from '../types/notification';

export function getByUser(userId: string): Preference[] {
  log('debug', 'service', `preferenceSvc.getByUser — userId: ${userId}`);
  return repo.findByUser(userId);
}

export function getById(id: string): Preference | undefined {
  log('debug', 'service', `preferenceSvc.getById — id: ${id}`);
  return repo.findById(id);
}

export function create(dto: CreatePreferenceDto): { ok: boolean; data?: Preference; err?: string } {
  log('debug', 'service', `preferenceSvc.create — userId: ${dto.userId}, channel: ${dto.channel}`);

  const user = userRepo.findById(dto.userId);
  if (!user) {
    log('warn', 'service', `preferenceSvc.create — user not found: ${dto.userId}`);
    return { ok: false, err: 'User not found' };
  }

  const existing = repo.findByUserAndChannel(dto.userId, dto.channel);
  if (existing) {
    log('warn', 'service', `preferenceSvc.create — preference exists: ${dto.userId}/${dto.channel}`);
    return { ok: false, err: 'Preference for this channel already exists' };
  }

  const p = repo.create(dto);
  log('info', 'service', `preferenceSvc.create — created preference: ${p.id}`);
  return { ok: true, data: p };
}

export function update(id: string, dto: UpdatePreferenceDto): { ok: boolean; data?: Preference; err?: string } {
  log('debug', 'service', `preferenceSvc.update — id: ${id}`);

  const p = repo.update(id, dto);
  if (!p) {
    log('warn', 'service', `preferenceSvc.update — preference not found: ${id}`);
    return { ok: false, err: 'Preference not found' };
  }

  log('info', 'service', `preferenceSvc.update — updated preference: ${id}`);
  return { ok: true, data: p };
}

export function remove(id: string): { ok: boolean; err?: string } {
  log('debug', 'service', `preferenceSvc.remove — id: ${id}`);

  const p = repo.findById(id);
  if (!p) {
    log('warn', 'service', `preferenceSvc.remove — preference not found: ${id}`);
    return { ok: false, err: 'Preference not found' };
  }

  repo.remove(id);
  log('info', 'service', `preferenceSvc.remove — deleted preference: ${id}`);
  return { ok: true };
}
