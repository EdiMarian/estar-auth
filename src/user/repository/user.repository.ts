import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto';
import * as uuid4 from 'uuid4';
import { User, UserAddress, UserVips } from '@prisma/client';
import { levels } from 'src/common/constants';
import { LinkAddressDto } from '../dto';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findAddress(address: string): Promise<UserAddress[]> {
    return this.prismaService.userAddress.findMany({
      where: { address: address },
    });
  }

  async findOneByAddress(address: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        addresses: {
          some: {
            address,
          },
        },
      },
    });
  }

  async findUsername(username: string): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: { username: { equals: username, mode: 'insensitive' } },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string, args: any): Promise<any | null> {
    const user: any = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    if (args.withAddresses) {
      user.addresses = await this.findUserAddresses(id);
    }
    if (args.withVip) {
      user.vip = await this.prismaService.userVips.findFirst({
        where: { userId: id },
      });
    }
    if (args.withSubscription) {
      user.subscription = await this.prismaService.userSubscriptions.findFirst({
        where: { userId: id },
      });
    }

    return user;
  }

  async findUserAddresses(userId: string): Promise<UserAddress[]> {
    return this.prismaService.userAddress.findMany({
      where: { userId },
    });
  }

  async createUser(dto: RegisterDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        id: uuid4(),
        username: dto.username,
        diamonds: 0,
        addressesIDs: [],
        vipID: null,
        roles: ['MEMBER'],
        subscriptionID: null,
        activityPaymentsIDs: [],
      },
    });
  }

  async gainUserVipXp(userId: string, xp: number): Promise<UserVips> {
    const vip = await this.prismaService.userVips.findFirst({
      where: { userId },
    });
    if (!vip) throw new Error('User VIP not found');

    vip.xp += xp;

    // Actualizează nivelul VIP dacă este necesar
    while (
      vip.level < levels.length &&
      vip.xp >= levels[vip.level - 1].requiredXP
    ) {
      vip.level++;
      this.logger.log(`User ${userId} leveled up to ${vip.level}`);
    }

    return this.prismaService.userVips.update({
      where: { id: vip.id },
      data: { xp: vip.xp, level: vip.level },
    });
  }

  async insertUserAddress(userId: string, dto: LinkAddressDto): Promise<User> {
    const userAddress = await this.prismaService.userAddress.create({
      data: {
        id: uuid4(),
        userId,
        chain: dto.chain,
        address: dto.address,
      },
    });

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        addressesIDs: {
          push: userAddress.id,
        },
      },
      include: { addresses: true, vip: true },
    });

    return user;
  }
}
