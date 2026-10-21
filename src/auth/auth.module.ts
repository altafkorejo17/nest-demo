import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { JwtUserProvider } from './jwt-user.provider.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [JwtUserProvider],
})
export class AuthModule {}
