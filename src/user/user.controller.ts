import { Controller, UseGuards, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from './decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    @Get('')
    getUsers(@GetUser() user: User) {
        return user;
    }
}
