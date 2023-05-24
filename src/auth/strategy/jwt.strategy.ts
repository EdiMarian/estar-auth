import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../user/repository/user.repository';
import { cleanDocument } from 'src/common/functions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly userRepository: UserRepository, config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }
    
    async validate(payload: any) {
        const user = await this.userRepository.findOne(payload.sub);
        return cleanDocument(user);
    }
}