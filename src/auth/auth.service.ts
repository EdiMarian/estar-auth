import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {}

    async login(dto: AuthDto): Promise<any> {
        // check user exists
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if(!userExists) {
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    username: dto.username
                }
            });
            delete user.id;
            return user;
        }
        return '';
    }
}
