import { Controller, UseGuards, Get } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from './decorator';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    // @Get('/me')
    // getUser(@GetUser() user: User): User {
    //     return user;
    // }
}
