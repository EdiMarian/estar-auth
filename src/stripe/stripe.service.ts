import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderRepository } from '../order/repository/order.repository';
import { OrderStatus, PaymentMethod } from 'src/common/types';
import { CreateOrderDto } from 'src/order/dto';
import { ShopRepository } from '../shop/repository/shop.repository';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class StripeService {
    stripe: Stripe;
    private readonly logger = new Logger(StripeService.name);
    constructor(
        configService: ConfigService,
        private readonly orderRepository: OrderRepository,
        private readonly shopRepository: ShopRepository,
        private readonly userRepository: UserRepository,
    ) {
        this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
            apiVersion: '2022-11-15',
        });
    }

    async webhook(event: Stripe.Event) {
        if (event.type === 'checkout.session.completed') {
            const session: any = event.data?.object;
            const metadata = session.metadata;

            // create order
            await this.createOrder(metadata.userId, metadata.itemId, OrderStatus.COMPLETED);

            // check if item exists
            const item = await this.shopRepository.findOne(metadata.itemId);
            if (!item) {
                this.logger.error(`Item ${metadata.itemId} not found`);
                return;
            }

            // update user
            switch (item.name) {
                case 'subscription':
                    // add subscription to user
                    break;
                case 'diamonds':
                    await this.updateUserDiamonds(metadata.userId, item.amount);
                    break;
                default:    
                    this.logger.error(`For item ${item.name} no action is defined`);
                    break;
            }
        }
    }

    async updateUserDiamonds(userId: string, amount: number) {
        // check if user exists
        const user = await this.userRepository.findOne(userId, {});
        if (!user) {
            this.logger.error(`User ${userId} not found`);
            return;
        }

        // update user
        user.diamonds += amount;
        this.userRepository.updateUser(user);

        this.logger.log(`User ${userId} updated with ${amount} diamonds`);
    }

    async createOrder(userId: string, itemId: string, status: OrderStatus) {
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
