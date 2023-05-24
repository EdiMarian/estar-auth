import { Injectable } from '@nestjs/common';
import { CosmosService } from '../../cosmos/cosmos.service';
import { User, UserAddress } from 'src/common/types';
import { RegisterDto } from 'src/auth/dto';
import * as uuid4 from 'uuid4';
import { cleanDocument } from 'src/common/functions';

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

    async findUsername(username: string) {
        const query: string = 'SELECT * FROM c WHERE c.username = @username'
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

    async createUser(dto: RegisterDto) {
        const { username, chain, address } = dto;
        const userId = uuid4()
        const userAddress = await this.creatUserAddress(userId, chain, address);
        const user: User = {
            id: userId,
            username,
            addressesIDs: [userAddress.id],
        }

        const { resource } = await this.cosmosService.users().items.create<User>(user)
        return {
            ...cleanDocument(resource),
            addresses: [cleanDocument(userAddress)]
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
}