import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { RevenueModule } from './revenue/revenue.module';
import {
  CacheModule,
  RedisCacheModuleOptions,
} from '@multiversx/sdk-nestjs-cache';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.forRoot({
      config: {
        host: '127.0.0.1',
        port: 6379,
      },
    } as RedisCacheModuleOptions),
    AuthModule,
    UserModule,
    AdminModule,
    RevenueModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
