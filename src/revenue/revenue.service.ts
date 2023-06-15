import { Injectable } from '@nestjs/common';
import { getChainAddress } from 'src/common/functions';
import { getAddressRevenue } from 'src/common/functions';
import { revenue } from './revenue';

@Injectable()
export class RevenueService {
    getUserRevenue(addresses: any) {
        const chainAddress = getChainAddress(addresses, 'multiversx')
        if(chainAddress) {
            return getAddressRevenue(chainAddress.address);
        }
        return [];
    }

    getTopPlayersRevenue(last?: number) {
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

        return allUsers;
    }
}
