import { Injectable } from '@nestjs/common';
import { CosmosService } from '../../cosmos/cosmos.service';
import { FindUserArgs, Role, User, UserAddress, UserVips } from 'src/common/types';
import { RegisterDto } from 'src/auth/dto';
import * as uuid4 from 'uuid4';
import { cleanDocument } from 'src/common/functions';
import { LinkAddressDto } from '../dto';

@Injectable()
export class UserRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async findAll(): Promise<User[]> {
        const { resources } = await this.cosmosService.users().items.readAll<User>().fetchAll();
        return resources;
    }

    async findOne(id: string, args: FindUserArgs): Promise<User> {
        const { resource } = await this.cosmosService.users().item(id, id).read<User>();
        if (args.withAddresses) {
            const addresses = await this.findUserAddresses(id);
            resource.addresses = addresses;
        }
        if (args.withVip) {
            const vip = await this.findUserVips(resource.vipID, id);
            resource.vip = vip;
        }
        if (args.withSubscription) {
            const subscription = await this.findUserSubscription(resource.subscriptionID, id);
            resource.subscription = subscription;
        }
        if (args.withActivityPayments) {
            const activityPayments = await this.findUserActivityPayments(id);
            resource.activityPayments = activityPayments;
        }
        
        return resource;
    }

    async findAddress(address: string) {
        const query: string = 'SELECT * FROM c WHERE c.address = @address'
        const { resources } = await this.cosmosService.userAddresses().items.query({
            query: query,
            parameters: [
                {
                    name: '@address',
                    value: address
                }
            ]
        }).fetchNext();
        return resources;
    }

    async findUserAddresses(userId: string): Promise<UserAddress[]> {
        const query: string = 'SELECT * FROM c WHERE c.userId = @userId'
        const { resources } = await this.cosmosService.userAddresses().items.query<UserAddress>({
            query: query,
            parameters: [
                {
                    name: '@userId',
                    value: userId
                }
            ]
        }).fetchNext();
        return resources;
    }

    async findUserAddress(addressId: string, userId: string) {
        const { resource } = await this.cosmosService.userAddresses().item(addressId, userId).read<UserAddress>();
        return resource;
    }

    async findUsername(username: string) {
        const query: string = 'SELECT * FROM c WHERE LOWER(c.username) = LOWER(@username)'
        const { resources } = await this.cosmosService.users().items.query({
            query: query,
            parameters: [
                {
                    name: '@username',
                    value: username
                }
            ]
        }).fetchNext();
        return resources;
    }

    async findUserVips(vipId: string, userId: string): Promise<UserVips> {
        const { resource } = await this.cosmosService.userVips().item(vipId, userId).read<UserVips>();
        return resource;
    }

    async findUserSubscription(subscriptionId: string, userId: string) {
        return null;
    }

    async findUserActivityPayments(userId: string) {
        return [null];
    }

    async createUser(dto: RegisterDto) {
        const { username, chain, address } = dto;
        const userId = uuid4()
        const userAddress = await this.creatUserAddress(userId, chain, address);
        const userVips = await this.creatUserVips(userId);
        const user: User = {
            id: userId,
            username,
            addressesIDs: [userAddress.id],
            vipID: userVips.id,
            roles: [Role.MEMBER],
            subscriptionID: null,
            activityPaymentsIDs: [],
        }

        const { resource } = await this.cosmosService.users().items.create<User>(user)
        return {
            ...cleanDocument<User>(resource, 'addresses', true),
            addresses: [cleanDocument<UserAddress>(userAddress)],
            vip: cleanDocument<UserVips>(userVips),
        };
    }

    private async creatUserAddress(userId: string, chain: string, address: string): Promise<UserAddress> {
        const { resource } = await this.cosmosService.userAddresses().items.create<UserAddress>({
            id: uuid4(),
            userId,
            chain,
            address
        });
        return resource;
    }

    private async creatUserVips(userId: string): Promise<UserVips> {
        const { resource } = await this.cosmosService.userVips().items.create<UserVips>({
            id: uuid4(),
            userId,
            name: 'VIP1',
            xp: 0,
        });
        return resource;
    }

    async insertUserAddress(userId: string, dto: LinkAddressDto): Promise<User> {
        // Desctructure the dto
        const { chain, address } = dto;

        // Create the user address
        const userAddress = await this.creatUserAddress(userId, chain, address);

        // Get the user
        const user = await this.findOne(userId, { withAddresses: true, withVip: true });

        // Add the address to the user
        user.addressesIDs.push(userAddress.id);

        // Update the user
        const { resource } = await this.cosmosService.users().item(userId, userId).replace<User>(user);
        return {
            ...cleanDocument<User>(resource, '', true),
        }
    }
}