import { Controller, UseGuards, Get } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    @Get('')
    getUsers() {
        return "hi";
    }
}
