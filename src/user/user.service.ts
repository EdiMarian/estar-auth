import { ForbiddenException, Injectable } from '@nestjs/common';
import { Address } from '@multiversx/sdk-core/out';
import { UserRepository } from './repository/user.repository';
import { User } from 'src/common/types';
import { ItemDefinition } from '@azure/cosmos';
import { LinkAddressDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly authService: AuthService) {}

    getUsers(): Promise<ItemDefinition[]> {
        return this.userRepository.findAll();
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
        const userFound = await this.userRepository.findOne(id);
        if(!userFound) {
            throw new ForbiddenException("User not found");
        }

        // Address Validation
        const addressesFound = await this.userRepository.findAddress(address);
        if(addressesFound.length > 0) {
            throw new ForbiddenException("Address already exists");
        }

        if(chain === chains[0]) {
            const { email } = await this.authService.verifyGoogleToken(address);
            dto.address = email;
        }

        // Insert User Address
        const user = await this.userRepository.insertUserAddress(id, dto);
        return user;
    }
}
