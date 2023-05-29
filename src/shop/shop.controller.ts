import { Controller, UseGuards, Post, Get } from '@nestjs/common';
import { AdminGuard } from 'src/admin/guard/admin.guard';

@Controller('shop')
export class ShopController {

    @Post('/item')
    @UseGuards(AdminGuard)
    createItem() {}

    @Get('/items')
    getItems() {
        return ''
    }
}
