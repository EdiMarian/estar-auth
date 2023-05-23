import { Module } from '@nestjs/common';
import { CosmosService } from './cosmos.service';

@Module({
  providers: [CosmosService]
})
export class CosmosModule {}
