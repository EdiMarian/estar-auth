import { Controller, UseGuards, Get } from '@nestjs/common';
import { AdminGuard } from 'src/admin/guard/admin.guard';

@UseGuards(AdminGuard)
@Controller('shop')
export class ShopController {

    @Get('/items')
    getItems() {
        return 'salut'
    }
}
