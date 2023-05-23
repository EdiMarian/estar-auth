import { ForbiddenException, Injectable } from '@nestjs/common';
import { Address } from '@multiversx/sdk-core/out';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    getUsers() {
        return this.userRepository.findAll();
    }
}
