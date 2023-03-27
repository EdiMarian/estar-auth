import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginDto } from './dto/Login.dto';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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
                    if(err.code === 'P2002') throw new ForbiddenException("User exists!")
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

    async verifyGoogleToken(token: string): Promise<TokenPayload> {
        try {
            const google_token = await googleClient.verifyIdToken({
                idToken: token,
                audience: this.configService.get("GOOGLE_CLIENT_ID"),
            });
            return google_token.getPayload();
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
