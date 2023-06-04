import { Injectable } from '@nestjs/common';
import { CosmosService } from "src/cosmos/cosmos.service";
import { CreateOrderDto } from '../dto';
import { Order } from 'src/common/types';

@Injectable()
export class OrderRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async createOrder(dto: CreateOrderDto): Promise<Order> {
        const { resource } = await this.cosmosService.orders().items.create(dto);
        return resource;
    }
}