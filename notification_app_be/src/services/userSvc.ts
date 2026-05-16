import * as repo from '../repository/userRepo';
import * as notifRepo from '../repository/notificationRepo';
import * as prefRepo from '../repository/preferenceRepo';
import { log } from '../utils/log';
import type { User, CreateUserDto } from '../types/notification';

export function getAll(): User[] {
  log('debug', 'service', 'userSvc.getAll — fetching all users');
  const us = repo.findAll();
  log('info', 'service', `userSvc.getAll — found ${us.length} users`);
  return us;
}

export function getById(id: string): User | undefined {
  log('debug', 'service', `userSvc.getById — id: ${id}`);
  const u = repo.findById(id);
  if (!u) {
    log('warn', 'service', `userSvc.getById — user not found: ${id}`);
  }
  return u;
}

export function create(dto: CreateUserDto): { ok: boolean; data?: User; err?: string } {
  log('debug', 'service', `userSvc.create — email: ${dto.email}`);

  const existing = repo.findByEmail(dto.email);
  if (existing) {
    log('warn', 'service', `userSvc.create — duplicate email: ${dto.email}`);
    return { ok: false, err: 'User with this email already exists' };
  }

  const u = repo.create(dto);
  log('info', 'service', `userSvc.create — created user: ${u.id}, email: ${u.email}`);
  return { ok: true, data: u };
}

export function remove(id: string): { ok: boolean; err?: string } {
  log('debug', 'service', `userSvc.remove — id: ${id}`);

  const u = repo.findById(id);
  if (!u) {
    log('warn', 'service', `userSvc.remove — user not found: ${id}`);
    return { ok: false, err: 'User not found' };
  }

  notifRepo.removeByUser(id);
  prefRepo.removeByUser(id);
  repo.remove(id);

  log('info', 'service', `userSvc.remove — deleted user: ${id}`);
  return { ok: true };
}
