import { Body, Controller, Post, Req, RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { buffer } from 'micro';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService, private readonly configService: ConfigService) {}

    @Post('/webhook')
    async webhook(@Req() req: RawBodyRequest<Request>) {
        const payload = req.rawBody;
        const sig = req.headers['stripe-signature'];
        const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

        const event = this.stripeService.stripe.webhooks.constructEvent(
            payload,
            sig,
            endpointSecret,
        );
        if (event.type === 'checkout.session.completed') {
            const session: any = event.data?.object;
            const metadata = session.metadata;
            console.log(metadata);
        }
    }
}
