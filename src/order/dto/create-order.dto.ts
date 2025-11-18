/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class CreateOrderDto{
    @IsString()
    customerName: string;

    @IsString()
    customerEmail: string;

    items: {
        productId: string,
        qty: number,
    }[];
}