import { ForbiddenException, Injectable } from '@nestjs/common';
import { Address } from '@multiversx/sdk-core/out';
import { UserRepository } from './repository/user.repository';
import { User } from 'src/common/types';
import { ItemDefinition } from '@azure/cosmos';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    getUsers(): Promise<ItemDefinition[]> {
        return this.userRepository.findAll();
    }
}
