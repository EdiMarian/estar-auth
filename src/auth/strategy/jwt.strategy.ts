import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../user/repository/user.repository';
import { cleanDocument } from 'src/common/functions';
import { User, UserAddress, UserVips } from 'src/common/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly userRepository: UserRepository, config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }
    
    async validate(payload: any): Promise<User & {vip: UserVips}> {
        const user = await this.userRepository.findOne(payload.sub);
        if(!user) {
            return null;
        }
        const userAddresses = await this.userRepository.findUserAddresses(user.id);
        const userReturned = {
            ...cleanDocument<User>(user, 'addresses', true),
            connected: {
                chain: payload.chain,
                address: payload.address
            },
            addresses: [
                ...userAddresses.map((userAddress: UserAddress) => cleanDocument<UserAddress>(userAddress, 'user'))
            ],
            vip: cleanDocument<UserVips>(await this.userRepository.findUserVips(user.vipID, user.id))
        }
        return userReturned;
    }
}