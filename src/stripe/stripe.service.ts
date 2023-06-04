import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderRepository } from '../order/repository/order.repository';
import { OrderStatus, PaymentMethod } from 'src/common/types';
import { CreateOrderDto } from 'src/order/dto';

@Injectable()
export class StripeService {
    stripe: Stripe;
    private readonly logger = new Logger(StripeService.name);
    constructor(configService: ConfigService, private readonly orderRepository: OrderRepository) {
        this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
            apiVersion: '2022-11-15',
        });
    }

    async createAnOrder(userId: string, itemId: string, status: OrderStatus) {
        // create order
        const orderDto: CreateOrderDto = {
            itemId: itemId,
            userId: userId,
            method: PaymentMethod.FIAT,
            createdAt: new Date(),
            status: status,
        }

        // save order
        const order = await this.orderRepository.createOrder(orderDto);
        this.logger.log(`Order created: ${order.id}`);
    }
}
