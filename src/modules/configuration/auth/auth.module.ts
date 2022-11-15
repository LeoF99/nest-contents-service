import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import AuthStrategy from './auth.strategy';
import AuthGuard from './auth.guard';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [AuthStrategy, { provide: APP_GUARD, useClass: AuthGuard }],
})
export default class AuthModule {}
