import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import type { User } from '../users/user.entity.js';

// Reads `Authorization: Bearer <token>`, verifies it with the module's
// `accessToken` options, and loads the user from the token's `sub`.
@Injectable()
export class JwtUserProvider extends JwtBearerProvider<User> {
  constructor(
    private readonly users: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  validate({ sub }: JwtClaims) {
    return sub ? this.users.findById(sub) : null;
  }
}
