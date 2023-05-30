import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
    stripe: Stripe;
    constructor(configService: ConfigService) {
        this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
            apiVersion: '2022-11-15',
        });
    }
}
