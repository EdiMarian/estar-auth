import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    chain: string;

    @IsString()
    @IsNotEmpty()
    address: string;
}