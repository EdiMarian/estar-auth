import { Global, Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ShopRepository } from './repository';

@Global()
@Module({
  controllers: [ShopController],
  providers: [ShopService, ShopRepository],
  exports: [ShopRepository],
})
export class ShopModule {}
