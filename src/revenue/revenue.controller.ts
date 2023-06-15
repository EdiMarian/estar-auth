import { Controller, Get, OnModuleInit, Logger } from '@nestjs/common';;
import { RevenueService } from './revenue.service';

@Controller('revenue')
export class RevenueController implements OnModuleInit {
    private readonly logger = new Logger(RevenueController.name);
    constructor(private readonly revenueService: RevenueService) {}

    onModuleInit() {
        this.revenueService.cacheTopPlayersRevenue()
        .then(() => {this.logger.debug('Top players revenue cached!')})
        .catch((err) => {
            this.logger.error('Failed to cache top players revenue!', err);
            return setTimeout(() => this.onModuleInit(), 5000);
        });
    }

    @Get('/top')
    getTopPlayersRevenue() {
        return this.revenueService.getTopPlayersRevenueFromCache();
    }
}
