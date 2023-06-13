import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { UserRepository } from './repository/user.repository';
import { User, UserAddress } from 'src/common/types';
import { ItemDefinition } from '@azure/cosmos';
import { LinkAddressDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { includeAnChain } from 'src/common/functions';
import { ConfigService } from '@nestjs/config';
import { tokens } from 'src/common/constants/tokens';

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

    async getUserTokens(addresses: UserAddress[]): Promise<any> {
        if(includeAnChain(addresses, 'multiversx')) {
            const params = new URLSearchParams();
            params.append('identifiers', tokens.map((token) => token).join(','));
            const tokensFound = await this.apiProvider.doGetGeneric(`accounts/${addresses[0].address}/tokens?${params.toString()}`);
            return tokensFound.map((token) => {
                return {
                    identifier: token.identifier,
                    balance: token.balance / 10 ** token.decimals,
                }
            });
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
