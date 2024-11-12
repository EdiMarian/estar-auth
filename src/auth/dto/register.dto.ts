import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(62)
  username: string;

  @IsString()
  @IsNotEmpty()
  chain: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
