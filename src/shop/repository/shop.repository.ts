import { Injectable } from "@nestjs/common";
import { CosmosService } from '../../cosmos/cosmos.service';
import { CreateItemDto } from '../dto/create-item.dto';

@Injectable()
export class ShopRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async createItem(createItemDto: CreateItemDto) {
        return null;
    }
}