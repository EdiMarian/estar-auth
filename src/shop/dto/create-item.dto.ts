import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ItemType } from "src/common/types";

export class CreateItemDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

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
    type: ItemType;

    @IsNumber()
    @IsNotEmpty()
    period: number;
}