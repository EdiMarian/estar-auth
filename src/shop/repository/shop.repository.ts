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
        const { name, type, description, stripe_price_id, amount, price, givenXP, currency, image, paymentType, period } = createItemDto;

        // Create the item
        const { resource } = await this.cosmosService.shop().items.create({
            name,
            type,
            description,
            stripe_price_id,
            amount,
            price,
            givenXP,
            currency,
            image,
            paymentType,
            period,
        })
        
        return cleanDocument<ShopItem>(resource);
    }

    async findAll(): Promise<ShopItem[]> {
        const { resources } = await this.cosmosService.shop().items.readAll().fetchAll();
        return resources.map((resource: ShopItem) => cleanDocument<ShopItem>(resource));
    }

    async findOne(id: string): Promise<ShopItem> {
        const { resource } = await this.cosmosService.shop().item(id, id).read();
        return cleanDocument<ShopItem>(resource);
    }
}