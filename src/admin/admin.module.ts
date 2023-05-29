import { Module, Global } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminStrategy } from './strategy';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [UserModule],
  providers: [AdminService, AdminStrategy],
  exports: [AdminStrategy]
})
export class AdminModule {}
