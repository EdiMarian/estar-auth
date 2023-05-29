import { Injectable } from "@nestjs/common";
import { CosmosService } from '../../cosmos/cosmos.service';

@Injectable()
export class ShopRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async createItem() {
        return null;
    }
}