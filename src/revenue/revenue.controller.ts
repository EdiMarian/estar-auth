import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { RevenueService } from './revenue.service';

@Controller('revenue')
export class RevenueController {
    constructor(private readonly revenueService: RevenueService) {}
    @Get('/all')
    @UseGuards(JwtGuard)
    getAllRevenue() {
        return 'All revenue';
    }
}
