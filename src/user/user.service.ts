import { ForbiddenException, Injectable } from '@nestjs/common';
import { Address } from '@multiversx/sdk-core/out';
import { UserRepository } from './repository/user.repository';
import { User } from 'src/common/types';
import { ItemDefinition } from '@azure/cosmos';
import { LinkAddressDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly configService: ConfigService) {}

    getUsers(): Promise<ItemDefinition[]> {
        return this.userRepository.findAll();
    }

    async linkAddress(dto: LinkAddressDto, id: string): Promise<User> {
        // Deconstruct DTO
        const { chain, address } = dto;

        // Chain validation
        const chains = this.getChains();
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

        // Insert User Address
        const user = await this.userRepository.insertUserAddress(id, dto);
        return user;
    }

    private getChains(): string[] {
        return this.configService.get<string>('SUPPORTED_CHAINS').split(',');
    }
}
