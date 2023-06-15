import { Controller, Get, Param } from '@nestjs/common';;
import { RevenueService } from './revenue.service';

@Controller('revenue')
export class RevenueController {
    constructor(private readonly revenueService: RevenueService) {}

    @Get('/top')
    getTopPlayersRevenue(@Param('last') last?: number) {
        return this.revenueService.getTopPlayersRevenue(last);
    }
}
