import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ItemType, PaymentType } from "src/common/types";

export class CreateItemDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: ItemType;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    stripe_price_id: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsArray()
    @IsNotEmpty()
    currency: string[];

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    paymentType: PaymentType;

    @IsNumber()
    @IsNotEmpty()
    period: number;
}