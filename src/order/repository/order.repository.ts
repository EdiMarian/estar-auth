import { Injectable } from '@nestjs/common';
import { CosmosService } from "src/cosmos/cosmos.service";
import { CreateOrderDto } from '../dto';

@Injectable()
export class OrderRepository {
    constructor(private readonly cosmosService: CosmosService) {}

    async createOrder(dto: CreateOrderDto) {
        
    }
}