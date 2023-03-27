import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("/register")
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post("/login")
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
