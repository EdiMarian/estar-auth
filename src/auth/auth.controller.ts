import { Controller, Post, Body } from '@nestjs/common';
import { RegisterWeb2Dto, LoginWeb2Dto, RegisterWeb3Dto, LoginWeb3Dto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("/register/web2")
    registerWeb2(@Body() dto: RegisterWeb2Dto) {
        return this.authService.registerWeb2(dto);
    }

    @Post("/register/web3")
    registerWeb3(@Body() dto: RegisterWeb3Dto) {
        return this.authService.registerWeb3(dto);
    }

    @Post("/login/web2")
    loginWeb2(@Body() dto: LoginWeb2Dto) {
        return this.authService.loginWeb2(dto);
    }

    @Post("/login/web3")
    loginWeb3(@Body() dto: LoginWeb3Dto) {
        return this.authService.loginWeb3(dto)
    }
}
