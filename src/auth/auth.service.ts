import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoginDto, RegisterDto } from './dto';
import { UserRepository } from '../user/repository/user.repository';
import { isValidString } from 'src/common/functions';
import { Token } from 'src/common/types';
import { listOfNegativeWords } from 'src/common/constants';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository,private jwtService: JwtService, private configService: ConfigService) {}

    async register(dto: RegisterDto): Promise<Token> {

        // Deconstruct DTO
        const { username, chain, address } = dto;

        // Chain validation
        const chains = this.getChains();
        if(!chains.includes(chain)) {
            throw new ForbiddenException("Chain not supported");
        }

        // Address Validation
        if(chain === chains[0]) {
            const { email } = await this.verifyGoogleToken(address);
            dto.address = email;
        }

        const addressesFound = await this.userRepository.findAddress(dto.address);
        if(addressesFound.length > 0) {
            throw new ForbiddenException("Address already exists");
        }

        // Username Validation
        const usernamesFound = await this.userRepository.findUsername(username);
        if(usernamesFound.length > 0) {
            throw new ForbiddenException("Username already exists");
        }

        if(!isValidString(username)) {
            throw new ForbiddenException("Invalid username");
        }
        
        if(listOfNegativeWords.some(negativeWord => username.includes(negativeWord))) throw new ForbiddenException("Your username contains bad words");

        // Create User
        const user = await this.userRepository.createUser(dto);
        return {
            token: await this.signToken(user.id, user.username, chain, dto.address),
        };
    }

    async login(dto: LoginDto): Promise<Token> {
        const { chain, address } = dto;

        // Chain validation
        const chains = this.getChains();
        if(!chains.includes(chain)) {
            throw new ForbiddenException("Chain not supported");
        }

        // Address Validation
        if(chain === chains[0]) {
            const { email } = await this.verifyGoogleToken(address);
            dto.address = email;
        }

        const addressesFound = await this.userRepository.findAddress(dto.address);
        if(addressesFound.length === 0) {
            throw new UnauthorizedException("Address not found");
        }

        // Get User
        const user = await this.userRepository.findOne(addressesFound[0].userId);

        // Validate User
        if(!user) {
            throw new UnauthorizedException("User not found");
        }

        // Sign Token
        return {
            token: await this.signToken(user.id, user.username, chain, dto.address),
        };
    }

    signToken(userId: string, username: string, chain: string, address: string): Promise<string> {
        const payload = {
            sub: userId,
            username,
            chain,
            address
        }
        return this.jwtService.signAsync(payload, {
            expiresIn: '60m',
            secret: this.configService.get("JWT_SECRET")
        })
    }

    getChains(): string[] {
        return this.configService.get("SUPPORTED_CHAINS").split(",");
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
            throw new UnauthorizedException(['Invalid Google Token!', err.message]);
        }
    }
}
