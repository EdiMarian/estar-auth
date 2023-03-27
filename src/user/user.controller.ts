import { Controller, UseGuards, Get, Patch, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from './decorator';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    getUsers(@GetUser() user: User): User {
        return user;
    }

    @Patch('')
    linkMultiversXWallet(@GetUser('id') userId: string, @Body('address') address: string): Promise<User> {
        return this.userService.linkMultiversXWallet(userId, address);
    }
}
