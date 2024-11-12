import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderRepository } from '../order/repository/order.repository';
import { ItemType, OrderStatus, PaymentMethod } from 'src/common/types';
import { CreateOrderDto } from 'src/order/dto';
import { ShopRepository } from '../shop/repository/shop.repository';
import { UserRepository } from '../user/repository/user.repository';
import * as uuid4 from 'uuid4';

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
            switch (item.type) {
                case ItemType.SUBSCRIPTION:
                    await this.updateUserSubscription(metadata.userId, item.period);
                    break;
                case ItemType.DIAMONDS:
                    await this.updateUserDiamonds(metadata.userId, item.amount);
                    break;
                default:    
                    this.logger.error(`For item ${item.name} no action is defined`);
                    break;
            }

            // update user vip xp
            await this.userRepository.gainUserVipXp(metadata.userId, item.givenXP);
        }
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

    async updateUserSubscription(userId: string, period: number) {
        // check if user exists
        const user = await this.userRepository.findOne(userId, { withSubscription: true});
        if (!user) {
            this.logger.error(`User ${userId} not found`);
            return;
        }

        // check if user has subscription
        if (user.subscription) {
            // get current expiration date
            const expiresAt = new Date(user.subscription.expiresAt);
            expiresAt.setDate(expiresAt.getDate() + period);

            // update subscription
            user.subscription.expiresAt = expiresAt;
            await this.userRepository.updateUserSubscription(userId, user.subscription);

            this.logger.log(`User ${userId} updated with subscription for ${period} days`);
        } else {
            // create subscription
            user.subscription = {
                id: uuid4(),
                userId: userId,
                method: PaymentMethod.FIAT,
                createdAt: new Date(),
                expiresAt: new Date(),
            }
            user.subscription.expiresAt.setDate(user.subscription.expiresAt.getDate() + period);

            // save subscription
            await this.userRepository.creatUserSubscription(user.subscription);

            // update user
            user.subscriptionID = user.subscription.id;

            // delete subscription from user and save
            delete user.subscription
            await this.userRepository.updateUser(user);

            this.logger.log(`User ${userId} created with subscription for ${period} days`);
        }
    }
}
