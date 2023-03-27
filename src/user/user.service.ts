import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address } from '@multiversx/sdk-core/out';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async linkMultiversXWallet(userId: string, address: string): Promise<User> {
        try {
            new Address(address);
        } catch {
            throw new ForbiddenException("Invalid address!");
        }

        const user = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                address: address
            }
        });

        delete user.id;
        return user;
    }
}
