import { Injectable,OnModuleInit } from '@nestjs/common';
import { CosmosService } from "src/cosmos/cosmos.service";
import { CreateOrderDto } from '../dto';
import { Order, OrderStatus } from 'src/common/types';

@Injectable()
export class OrderRepository implements OnModuleInit {
    constructor(private readonly cosmosService: CosmosService) {}

    async onModuleInit() {
       await this.findOne('8bb4d243-64de-4e3b-93b7-d87a422cd368', '995ee9ca-dfc4-47fb-9712-9ee7465f0e23')
    }

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