import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { User, UserRecord } from './user.entity.js';

// In-memory store for the example: users are lost on restart.
@Injectable()
export class UsersService {
  private readonly users: UserRecord[] = [];

  findById(id: string): User | undefined {
    const user = this.users.find((u) => u.id === id);
    return user && { id: user.id, email: user.email };
  }

  findByEmail(email: string): UserRecord | undefined {
    return this.users.find((u) => u.email === email.toLowerCase());
  }

  create(email: string, passwordHash: string): User {
    const user = { id: randomUUID(), email: email.toLowerCase(), passwordHash };
    this.users.push(user);
    return { id: user.id, email: user.email };
  }
}
