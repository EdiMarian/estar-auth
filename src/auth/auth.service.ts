import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginDto } from './dto/Login.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService, private configService: ConfigService) {}

    async register(dto: RegisterDto): Promise<any> {
        try {
            // check google token
            const { email } = await this.verifyGoogleToken(dto.token);

            // create user
            const user = await this.prismaService.user.create({
                data: {
                    email: email,
                    username: dto.username
                }
            });
            return this.signToken(user.id, user.email, user.username);
            } catch (err) {
                if(err instanceof PrismaClientKnownRequestError) {
                    if(err.code === 'P2002') {
                        if(err.meta.target === 'users_email_key') {
                            throw new ForbiddenException("This email is already taken!");
                        }
                        if(err.meta.target === 'users_username_key') {
                            throw new ForbiddenException("This username is already taken!");
                        }
                    }
                }
                throw err;
            }
    }

    async login(dto: LoginDto): Promise<string> {
        try {
            // check google token
            const { email } = await this.verifyGoogleToken(dto.token);

            // check user exists
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: email
                }
            });
            if(!user) throw new NotFoundException('User not found!');

            return this.signToken(user.id, user.email, user.username);
            } catch (err) {
                throw new UnauthorizedException(err.message);
            }
    }

    async verifyGoogleToken(token: string): Promise<{email: string, email_verified: true, locale: true}> {
        try {
            const { data } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return data;
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }
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
