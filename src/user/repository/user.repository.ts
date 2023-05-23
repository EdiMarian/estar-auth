import { Injectable } from '@nestjs/common';
import { CosmosService } from '../../cosmos/cosmos.service';

@Injectable()
export class UserRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async findAll() {
        const { resources } = await this.cosmosService.users().items.readAll().fetchAll();
        return resources;
    }
}