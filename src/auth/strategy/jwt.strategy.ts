import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../user/repository/user.repository';
import { cleanDocument } from 'src/common/functions';
import { User, UserAddress } from 'src/common/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly userRepository: UserRepository, config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }
    
    async validate(payload: any): Promise<User> {
        const user = await this.userRepository.findOne(payload.sub);
        if(!user) {
            return null;
        }
        const userAddresses = [];
        for(const addressId of user.addressesIDs) {
            const userAddress = await this.userRepository.findUserAddress(user.id, addressId);
            userAddresses.push(cleanDocument<UserAddress>(userAddress));
        }
        const userReturned = {
            ...cleanDocument<User>(user, 'addresses'),
            connected: {
                chain: payload.chain,
                address: payload.address
            },
            addresses: [
                ...userAddresses
            ],
        }
        return userReturned;
    }
}