import { Injectable } from '@nestjs/common';
import { CosmosService } from '../../cosmos/cosmos.service';
import { Roles, User, UserAddress } from 'src/common/types';
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

    async findOne(id: string): Promise<User> {
        const { resource } = await this.cosmosService.users().item(id, id).read<User>();
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

    async findUserAddress(userId: string, addressId: string) {
        const { resource } = await this.cosmosService.userAddresses().item(addressId, userId).read<UserAddress>();
        return resource;
    }

    async findUsername(username: string) {
        const query: string = 'SELECT * FROM c WHERE LOWER(c.username) = LOWER(@username)'
        const { resources, requestCharge } = await this.cosmosService.users().items.query({
            query: query,
            parameters: [
                {
                    name: '@username',
                    value: username
                }
            ]
        }).fetchNext();
        console.log(requestCharge)
        return resources;
    }

    async createUser(dto: RegisterDto) {
        const { username, chain, address } = dto;
        const userId = uuid4()
        const userAddress = await this.creatUserAddress(userId, chain, address);
        const user: User = {
            id: userId,
            username,
            role: [Roles.MEMBER],
            addressesIDs: [userAddress.id],
        }

        const { resource } = await this.cosmosService.users().items.create<User>(user)
        return {
            ...cleanDocument<User>(resource, 'addresses', true),
            addresses: [cleanDocument<UserAddress>(userAddress)]
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

    async insertUserAddress(userId: string, dto: LinkAddressDto): Promise<User & { addresses: UserAddress[]}> {
        // Desctructure the dto
        const { chain, address } = dto;

        // Create the user address
        const userAddress = await this.creatUserAddress(userId, chain, address);

        // Get the user
        const user = await this.findOne(userId);

        // Add the address to the user
        user.addressesIDs.push(userAddress.id);

        // Update the user
        const { resource } = await this.cosmosService.users().item(userId, userId).replace<User>(user);
        const userAddresses = await this.findUserAddresses(userId);
        return {
            ...cleanDocument<User>(resource, 'addresses', true),
            addresses: [
                ...userAddresses.map((userAddress: UserAddress) => cleanDocument<UserAddress>(userAddress, 'user'))
            ]
        }
    }
}