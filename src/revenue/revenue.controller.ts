import { Controller, Get, Query } from '@nestjs/common';;
import { RevenueService } from './revenue.service';

@Controller('revenue')
export class RevenueController {
    constructor(private readonly revenueService: RevenueService) {}

    @Get('/top')
    getTopPlayersRevenue(@Query('last') last?: number) {
        return this.revenueService.getTopPlayersRevenue(last);
    }
}
