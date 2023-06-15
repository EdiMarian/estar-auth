import { Injectable } from '@nestjs/common';
import { getChainAddress } from 'src/common/functions';
import { getAddressRevenue } from 'src/common/functions';

@Injectable()
export class RevenueService {
    getUserRevenue(addresses: any) {
        const chainAddress = getChainAddress(addresses, 'multiversx')
        if(chainAddress) {
            return getAddressRevenue(chainAddress.address);
        }
        return [];
    }
}
