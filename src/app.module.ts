import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CosmosModule } from './cosmos/cosmos.module';
import { ShopModule } from './shop/shop.module';
import { AdminModule } from './admin/admin.module';
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './order/order.module';
import { RevenueModule } from './revenue/revenue.module';
import {
  CacheModule,
  RedisCacheModuleOptions,
} from '@multiversx/sdk-nestjs-cache';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.forRoot({
      config: {
        host: '127.0.0.1',
        password: '1NgwNcfvDHUjAGIzXB0SPw9m5LvDmxsD599GNr8yqQgOaSf7Bp',
        port: 6479,
      },
    } as RedisCacheModuleOptions),
    AuthModule,
    UserModule,
    CosmosModule,
    ShopModule,
    AdminModule,
    StripeModule,
    OrderModule,
    RevenueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
