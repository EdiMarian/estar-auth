import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RegisterDto } from './dto';
import { UserRepository } from '../user/repository/user.repository';
import { User } from 'src/common/types';
import { isValidString } from 'src/common/functions';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository,private jwtService: JwtService, private configService: ConfigService) {}

    async register(dto: RegisterDto): Promise<User> {

        // Deconstruct DTO
        const { username, chain, address } = dto;

        // Username Validation
        const usernamesFound = await this.userRepository.findUsername(username);
        if(usernamesFound.length > 0) {
            throw new ForbiddenException("Username already exists");
        }

        if(!isValidString(username)) {
            throw new ForbiddenException("Invalid username");
        }

        // Chain validation
        const chains = this.getChains();
        if(!chains.includes(chain)) {
            throw new ForbiddenException("Chain not supported");
        }

        // Address Validation
        const addressesFound = await this.userRepository.findAddress(address);
        if(addressesFound.length > 0) {
            throw new ForbiddenException("Address already exists");
        }
        if(chain === chains[0]) {
            const { email } = await this.verifyGoogleToken(address);
            dto.address = email;
        }

        const user = await this.userRepository.createUser(dto);

        return user;
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

    private getChains(): string[] {
        return this.configService.get("SUPPORTED_CHAINS").split(",");
    }

    private async verifyGoogleToken(token: string): Promise<{email: string, email_verified: true, locale: true}> {
        try {
            const { data } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return data;
        } catch (err) {
            throw new UnauthorizedException(['Invalid Google Token!', err.message]);
        }
    }
}
