import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService, private configService: ConfigService) {}

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
        return userExists;
    }

    signToken(userId: string, email: string, username: string): Promise<string> {
        const payload = {
            sub: userId,
            email,
            username
        }
        return this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: this.configService.get("JWT_SECRET")
        })
    }
}
