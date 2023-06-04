import { Injectable, ForbiddenException } from '@nestjs/common';
import { ShopRepository } from './repository/shop.repository';
import { CreateItemDto } from './dto';
import { ShopItem } from 'src/common/types';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class ShopService {
    constructor(private readonly shopRepository: ShopRepository, private readonly stripeService: StripeService) {}

    async createItem(createItemDto: CreateItemDto) {
        return this.shopRepository.createItem(createItemDto);
    }

    async getItems(): Promise<ShopItem[]> {
        return await this.shopRepository.findAll();
    }

    async buyItem(id: string, userId: string): Promise<any> {
        // get item
        const item = await this.shopRepository.findOne(id);

        // check if item exists
        if (!item) throw new ForbiddenException('Item does not exist');

        // create stripe session
        const session = await this.stripeService.stripe.checkout.sessions.create({
            mode: item.type,
            line_items: [
                {
                    price: item.stripe_price_id,
                    quantity: 1,
                }
            ],
            success_url: 'http://localhost:3000/shop?success=true',
            cancel_url: 'http://localhost:3000/shop?cancelled=true',
            metadata: {
                item_id: item.id,
                user_id: userId,
            }
        });

        return session.url;
    }
}
