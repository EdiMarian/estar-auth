import { Injectable } from '@nestjs/common';
import { CosmosService } from '../../cosmos/cosmos.service';
import { User } from 'src/common/types';

@Injectable()
export class UserRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async findAll(): Promise<User[]> {
        const { resources } = await this.cosmosService.users().items.readAll<User>().fetchAll();
        return resources;
    }

    async findOne(id: string): Promise<User> {
        const { resource } = await this.cosmosService.users().item(id).read<User>();
        return resource;
    }
}