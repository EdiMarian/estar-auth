import { Controller, UseGuards, Get, Body, Patch, Param } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from './decorator';
import { UserService } from './user.service';
import { User, UserAddress, UserTokens } from 'src/common/types';
import { LinkAddressDto } from './dto';
import { RevenueService } from '../revenue/revenue.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService, private readonly revenueService: RevenueService) {}

    @Get('/me')
    getUser(@GetUser() user: User): User {
        return user;
    }

    @Get('/me/profile-image')
    getUserProfileImage(@GetUser() user: User) {
        return this.userService.getUserProfileImage(user.connected);
    }

    @Get('/me/tokens')
    getUserTokens(@GetUser('addresses') addresses: UserAddress[]): Promise<UserTokens[]> {
        return this.userService.getUserTokens(addresses);
    }

    @Get('/me/nfts')
    getUserNfts(@GetUser('addresses') addresses: UserAddress[], @Param('collection') collection?: string): Promise<any[]> {
        return this.userService.getUserNfts(addresses, collection);
    }

    @Get('/me/revenue')
    getUserRevenue(@GetUser('addresses') addresses: UserAddress[]): any[] {
        return this.revenueService.getUserRevenue(addresses);
    }

    @Get('/')
    getUsers() {
        return this.userService.getUsers();
    }

    @Patch('/me/link-address')
    async linkAddress(@Body() dto: LinkAddressDto, @GetUser() user: User): Promise<User> {
        return {...await this.userService.linkAddress(dto, user.id), connected: user.connected};
    }
}
