import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../user/repository/user.repository';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: UserRepository,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.userRepository.findOne(payload.sub, {
      withAddresses: true,
      withVip: true,
    });
    if (!user) {
      return null;
    }
    const userReturned = {
      connected: {
        chain: payload.chain,
        address: payload.address,
      },
    };
    return userReturned;
  }
}
