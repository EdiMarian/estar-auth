import { Injectable } from "@nestjs/common";
import { CosmosService } from '../../cosmos/cosmos.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { cleanDocument } from "src/common/functions";
import { ShopItem } from "src/common/types";

@Injectable()
export class ShopRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async createItem(createItemDto: CreateItemDto): Promise<ShopItem> {
        // Destructure the DTO
        const { name, description, amount, price, currency, image, type, period } = createItemDto;

        // Create the item
        const { resource } = await this.cosmosService.shop().items.create({
            name,
            description,
            amount,
            price,
            currency,
            image,
            type,
            period,
        })
        
        return cleanDocument<ShopItem>(resource);
    }
}