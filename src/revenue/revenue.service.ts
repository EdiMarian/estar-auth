import { Injectable } from '@nestjs/common';
import { getChainAddress } from 'src/common/functions';
import { getAddressRevenue } from 'src/common/functions';
import { revenue } from './revenue';
import { UserRepository } from '../user/repository/user.repository';
import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { Constants } from '@multiversx/sdk-nestjs-common';

@Injectable()
export class RevenueService {
    constructor(private readonly userRepository: UserRepository, private readonly cacheService: CacheService) {}

    getUserRevenue(addresses: any) {
        const chainAddress = getChainAddress(addresses, 'multiversx')
        if(chainAddress) {
            return getAddressRevenue(chainAddress.address);
        }
        return [];
    }

    async getTopPlayersRevenue(last?: number) {
        let usersMap = new Map();

        revenue.forEach(obj => {
            const { users } = obj;

            users.forEach(user => {
            const { address, value } = user;

            if (usersMap.has(address)) {
                usersMap.set(address, usersMap.get(address) + value);
            } else {
                usersMap.set(address, value);
            }
            });
        });

        let allUsers = [];
        for (const [address, value] of usersMap.entries()) {
            allUsers.push({ address, value });
        }

        allUsers.sort((a, b) => b.value - a.value);

        if (last) {
            allUsers = allUsers.slice(0, last);
        }

        // Update user with username
        for(const user of allUsers) {
            const username = await this.userRepository.getUsernameByAddress(user.address);
            user.username = username;
        }

        return allUsers;
    }

    async cacheTopPlayersRevenue() {
        const topPlayersRevenue = await this.getTopPlayersRevenue(9);
        await this.cacheService.set('topPlayersRevenue', topPlayersRevenue, Constants.oneMonth());
    }

    async getTopPlayersRevenueFromCache() {
        const topPlayersRevenue = await this.cacheService.get('topPlayersRevenue');
        if(topPlayersRevenue) {
            return topPlayersRevenue;
        }
        const founded = await this.getTopPlayersRevenue(9);
        await this.cacheService.set('topPlayersRevenue', founded, Constants.oneMonth());
        return founded;
    }
}
