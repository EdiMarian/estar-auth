import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { UserRepository } from './repository/user.repository';
import { User, UserAddress, UserConnected, UserTokens } from 'src/common/types';
import { ItemDefinition } from '@azure/cosmos';
import { LinkAddressDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { getChainAddress, getXPortalProfileImage } from 'src/common/functions';
import { ConfigService } from '@nestjs/config';
import { tokens } from 'src/common/constants/tokens';
import { collections } from 'src/common/constants';

@Injectable()
export class UserService {
    private readonly apiProvider: ApiNetworkProvider;
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {
        this.apiProvider = new ApiNetworkProvider(
            this.configService.get('MULTIVERSX_API_URL'),
            {
              timeout: 10_000,
            },
          );
    }

    getUsers(): Promise<ItemDefinition[]> {
        return this.userRepository.findAll();
    }

    async getUserProfileImage(connected: UserConnected): Promise<string> {
        const { chain, address } = connected;
        if(!address) throw new ForbiddenException("Address not provided");
        if(!chain) throw new ForbiddenException("Chain not provided");

        if(chain === this.authService.getChains()[0]) {
            return `https://avatars.dicebear.com/api/avataaars/${address}.svg`;
        }
        const image = getXPortalProfileImage(address);
        return image;
    }

    async getUserTokens(addresses: UserAddress[]): Promise<UserTokens[]> {
        const chainAddress = getChainAddress(addresses, 'multiversx');
        if(chainAddress) {
            const params = new URLSearchParams();
            params.append('identifiers', tokens.map((token) => token).join(','));
            const tokensFound = await this.apiProvider.doGetGeneric(`accounts/${chainAddress.address}/tokens?${params.toString()}`);
            return tokensFound.map((token) => {
                return {
                    identifier: token.identifier,
                    balance: token.balance / 10 ** token.decimals,
                }
            });
        }
        return [];
    }

    async getUserNfts(addresses: UserAddress[], collection?: string): Promise<any[]> {
        const chainAddress = getChainAddress(addresses, 'multiversx');
        if(chainAddress) {
            const params = new URLSearchParams();
            if(collection) {
                params.append('collection', collection);
            } else {
                params.append('collections', collections.map((collection) => collection).join(','));
            }
            params.append('size', '10000');
            const nftsFound = await this.apiProvider.doGetGeneric(`accounts/${chainAddress.address}/nfts?${params.toString()}`);
            return nftsFound;
        }
        return
    }

    async linkAddress(dto: LinkAddressDto, id: string): Promise<User> {
        // Deconstruct DTO
        const { chain, address } = dto;

        // Chain validation
        const chains = this.authService.getChains();
        if(!chains.includes(chain)) {
            throw new ForbiddenException("Chain not supported");
        }

        // User Validation
        const userFound = await this.userRepository.findOne(id, { });
        if(!userFound) {
            throw new ForbiddenException("User not found");
        }

        // Address Validation
        if(chain === chains[0]) {
            const { email } = await this.authService.verifyGoogleToken(address);
            dto.address = email;
        }

        const addressesFound = await this.userRepository.findAddress(dto.address);
        if(addressesFound.length > 0) {
            throw new ForbiddenException("Address already exists");
        }

        // Insert User Address
        const user = await this.userRepository.insertUserAddress(id, dto);
        return user;
    }
}
