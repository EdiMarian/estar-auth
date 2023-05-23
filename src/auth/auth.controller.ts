import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/register")
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    // @Post("/login/web3")
    // loginWeb3(@Body() dto: LoginWeb3Dto) {
    //     return this.authService.loginWeb3(dto)
    // }
}
