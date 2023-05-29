import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ShopRepository } from './repository';

@Module({
  controllers: [ShopController],
  providers: [ShopService, ShopRepository]
})
export class ShopModule {}
