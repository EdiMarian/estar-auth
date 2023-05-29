import { Injectable } from '@nestjs/common';
import { ShopRepository } from './repository/shop.repository';
import { CreateItemDto } from './dto';

@Injectable()
export class ShopService {
    constructor(private readonly shopRepository: ShopRepository) {}

    async createItem(createItemDto: CreateItemDto) {
        return this.shopRepository.createItem(createItemDto);
    }
}
