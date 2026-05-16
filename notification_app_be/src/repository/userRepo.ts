import type { User, CreateUserDto } from '../types/notification';

const users = new Map<string, User>();

function genId(): string {
  return crypto.randomUUID();
}

export function findAll(): User[] {
  return Array.from(users.values());
}

export function findById(id: string): User | undefined {
  return users.get(id);
}

export function findByEmail(email: string): User | undefined {
  return Array.from(users.values()).find((u) => u.email === email);
}

export function create(dto: CreateUserDto): User {
  const u: User = {
    id: genId(),
    email: dto.email,
    name: dto.name,
    createdAt: new Date(),
  };
  users.set(u.id, u);
  return u;
}

export function remove(id: string): boolean {
  return users.delete(id);
}
