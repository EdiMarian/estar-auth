import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from '../auth/strategy';
import { UserRepository } from './repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy]
})
export class UserModule {}
