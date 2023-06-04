import { Injectable } from '@nestjs/common';
import { CosmosService } from "src/cosmos/cosmos.service";
import { CreateOrderDto } from '../dto';
import { Order, OrderStatus } from 'src/common/types';

@Injectable()
export class OrderRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async createOrder(dto: CreateOrderDto): Promise<Order> {
        const { resource } = await this.cosmosService.orders().items.create(dto);
        return resource;
    }

    async findOne(userId: string, orderId: string): Promise<Order> {
        const { resource } = await this.cosmosService.orders().item(orderId, userId).read();
        return resource;
    }

    async updateStatus(userId: string, orderId: string, status: OrderStatus, order: Order): Promise<Order> {
        const { resource } = await this.cosmosService.orders().item(orderId, userId).replace<Order>({
            ...order,
            status: status,
        });
        return resource;
    }
}