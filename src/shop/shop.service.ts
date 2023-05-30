import { Injectable } from '@nestjs/common';
import { ShopRepository } from './repository/shop.repository';
import { CreateItemDto } from './dto';
import { ShopItem } from 'src/common/types';

@Injectable()
export class ShopService {
    constructor(private readonly shopRepository: ShopRepository) {}

    async createItem(createItemDto: CreateItemDto) {
        return this.shopRepository.createItem(createItemDto);
    }

    async getItems(): Promise<ShopItem[]> {
        return await this.shopRepository.findAll();
    }
}
