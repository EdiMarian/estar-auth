import { Global, Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';

@Global()
@Module({
  providers: [RevenueService],
  controllers: [RevenueController],
  exports: [RevenueService]
})
export class RevenueModule {}
