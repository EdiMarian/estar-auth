import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterWeb2Dto, LoginWeb2Dto, LoginWeb3Dto, RegisterWeb3Dto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import axios from 'axios';
import { Address } from '@multiversx/sdk-core/out';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService, private configService: ConfigService) {}

    async registerWeb2(dto: RegisterWeb2Dto): Promise<any> {
        try {
            // check google token
            const { email } = await this.verifyGoogleToken(dto.token);

            // check if email is already taken
            const emailTaken = await this.prismaService.user.findFirst({
                where: {
                    email: email,
                }
            });

            if(emailTaken) throw new ForbiddenException("This email is already taken!");

            // create user
            const user = await this.prismaService.user.create({
                data: {
                    email: email,
                    username: dto.username
                }
            });
            return this.signWeb2Token(user.id, user.email, user.username);
            } catch (err) {
                if(err instanceof PrismaClientKnownRequestError) {
                    if(err.code === 'P2002') {
                        if(err.meta.target === 'users_username_key') {
                            throw new ForbiddenException("This username is already taken!");
                        }
                    }
                }
                throw err;
            }
    }

    async registerWeb3(dto: RegisterWeb3Dto): Promise<any> {
        try {
            // check erd address
            new Address(dto.address);

            // check if address is already taken
            const addressTaken = await this.prismaService.user.findFirst({
                where: {
                    address: dto.address,
                }
            });

            if(addressTaken) throw new ForbiddenException("This address is already taken!");

            // create user
            const user = await this.prismaService.user.create({
                data: {
                    address: dto.address,
                    username: dto.username
                }
            });

            return this.signWeb3Token(user.id, user.address, user.username);
            } catch (err) {
                if(err instanceof PrismaClientKnownRequestError) {
                    if(err.code === 'P2002') {
                        if(err.meta.target === 'users_username_key') {
                            throw new ForbiddenException("This username is already taken!");
                        }
                    }
                }
                throw err;
            }
    }

    async loginWeb2(dto: LoginWeb2Dto): Promise<string> {
        try {
            // check google token
            const { email } = await this.verifyGoogleToken(dto.token);

            // check user exists
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: email
                }
            });
            if(!user) throw new NotFoundException('User not found!');

            return this.signWeb2Token(user.id, user.email, user.username);
            } catch (err) {
                throw new UnauthorizedException(err.message);
            }
    }

    async loginWeb3(dto: LoginWeb3Dto): Promise<string> {
        try {
            // check erd address
            new Address(dto.address);

            // check user exists
            const user = await this.prismaService.user.findFirst({
                where: {
                    address: dto.address
                }
            });
            if(!user) throw new NotFoundException('User not found!');

            return this.signWeb3Token(user.id, user.address, user.username);
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

    signWeb2Token(userId: string, email: string, username: string): Promise<string> {
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

    signWeb3Token(userId: string, address: string, username: string): Promise<string> {
        const payload = {
            sub: userId,
            address,
            username
        }
        return this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: this.configService.get("JWT_SECRET")
        })
    }
}
