import { Controller, UseGuards, Get, Patch, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from './decorator';
import { UserService } from './user.service';
import { LinkAddressDto, LinkEmailDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/me')
    getUser(@GetUser() user: User): User {
        return user;
    }

    @Patch('/address')
    linkAddress(@GetUser('id') userId: string, @Body() dto: LinkAddressDto): Promise<User> {
        return this.userService.linkAddress(userId, dto.address);
    }

    @Patch('/email')
    linkEmail(@GetUser('id') userId: string, @Body() dto: LinkEmailDto): Promise<User> {
        return this.userService.linkEmail(userId, dto.email);
    }
}
