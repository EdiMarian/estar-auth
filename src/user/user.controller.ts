import { Controller, UseGuards, Get, Body, Patch } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from './decorator';
import { UserService } from './user.service';
import { User } from 'src/common/types';
import { LinkAddressDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/me')
    getUser(@GetUser() user: User): User {
        return user;
    }

    @Get('/')
    getUsers() {
        return this.userService.getUsers();
    }

    @Patch('/me/link-address')
    async linkAddress(@Body() dto: LinkAddressDto, @GetUser('id') id: string): Promise<User> {
        return await this.userService.linkAddress(dto, id);
    }
}
