import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminStrategy } from './strategy';

@Module({
  providers: [AdminService, AdminStrategy]
})
export class AdminModule {}
