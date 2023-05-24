import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/register")
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post("/login")
    loginWeb3(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }
}
