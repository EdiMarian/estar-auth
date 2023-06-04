import { Global, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRepository } from './repository';

@Global()
@Module({
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository]
})
export class OrderModule {}
