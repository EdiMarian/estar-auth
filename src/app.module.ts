import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CosmosModule } from './cosmos/cosmos.module';
import { ShopModule } from './shop/shop.module';
import { AdminModule } from './admin/admin.module';
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule, UserModule, CosmosModule, ShopModule, AdminModule, StripeModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
