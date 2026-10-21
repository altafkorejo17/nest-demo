import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CurrentUser,
  PasswordHasher,
  Public,
  TokenService,
} from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import type { User } from '../users/user.entity.js';

interface Credentials {
  email?: string;
  password?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly users: UsersService,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() body: Credentials) {
    const { email, password } = this.check(body);
    if (this.users.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }
    const user = this.users.create(email, await this.hasher.hash(password));
    return this.tokens.issue(user.id);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: Credentials) {
    const { email, password } = this.check(body);
    const user = this.users.findByEmail(email);
    // verify() checks a dummy hash for unknown users, so timing doesn't leak which emails exist.
    if (!(await this.hasher.verify(password, user?.passwordHash)) || !user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.tokens.issue(user.id);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('refreshToken is required');
    return this.tokens.refresh(refreshToken);
  }

  @Public()
  @Post('logout')
  @HttpCode(204)
  async logout(@Body('refreshToken') refreshToken: string) {
    if (refreshToken) await this.tokens.revoke(refreshToken);
  }

  @Get('me')
  me(@CurrentUser() user: User) {
    return user;
  }

  private check({ email, password }: Credentials) {
    if (typeof email !== 'string' || !email.includes('@')) {
      throw new BadRequestException('A valid email is required');
    }
    if (typeof password !== 'string' || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    return { email, password };
  }
}
