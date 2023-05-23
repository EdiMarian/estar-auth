import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RegisterDto } from './dto';
import { UserRepository } from '../user/repository/user.repository';
import { User } from 'src/common/types';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository,private jwtService: JwtService, private configService: ConfigService) {}

    async register(dto: RegisterDto): Promise<User> {
        const address = await this.userRepository.findAddress(dto.address);
        if(address.length > 0) {
            throw new ForbiddenException("Address already exists");
        }
        const username = await this.userRepository.findUsername(dto.username);
        if(username.length > 0) {
            throw new ForbiddenException("Username already exists");
        }

        const user = await this.userRepository.createUser(dto);

        return user;
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
            expiresIn: '60m',
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
            expiresIn: '60m',
            secret: this.configService.get("JWT_SECRET")
        })
    }
}
