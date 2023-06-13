import { Controller, UseGuards, Get, Body, Patch, Param } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from './decorator';
import { UserService } from './user.service';
import { User, UserAddress, UserTokens } from 'src/common/types';
import { LinkAddressDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/me')
    getUser(@GetUser() user: User): User {
        return user;
    }

    @Get('/me/tokens')
    getUserTokens(@GetUser('addresses') addresses: UserAddress[]): Promise<UserTokens[]> {
        return this.userService.getUserTokens(addresses);
    }

    @Get('/me/nfts')
    getUserNfts(@GetUser('addresses') addresses: UserAddress[], @Param('collection') collection?: string): Promise<any[]> {
        return this.userService.getUserNfts(addresses, collection);
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
