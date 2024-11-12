import { Controller, UseGuards, Post, Get, Body } from '@nestjs/common';
import { AdminGuard } from 'src/admin/guard/admin.guard';
import { ShopItem } from 'src/common/types';
import { ShopService } from './shop.service';
import { CreateItemDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/user/decorator';

@Controller('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) {}

    @Post('/item')
    @UseGuards(AdminGuard)
    async createItem(@Body() createItemDto: CreateItemDto): Promise<ShopItem> {
        return this.shopService.createItem(createItemDto);
    }

    @Get('/items')
    @UseGuards(JwtGuard)
    async getItems(): Promise<ShopItem[]> {
        return await this.shopService.getItems();
    }

    @Post('/buy')
    @UseGuards(JwtGuard)
    async buyItem(@Body('id') id: string, @GetUser('id') userId: string): Promise<any> {
        return await this.shopService.buyItem(id, userId);
    }
}
