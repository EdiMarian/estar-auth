import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // @Post("/register/web3")
    // registerWeb3(@Body() dto: RegisterWeb3Dto) {
    //     return this.authService.registerWeb3(dto);
    // }

    // @Post("/login/web3")
    // loginWeb3(@Body() dto: LoginWeb3Dto) {
    //     return this.authService.loginWeb3(dto)
    // }
}
