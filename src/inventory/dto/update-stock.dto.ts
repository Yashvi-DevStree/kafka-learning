import { IsNumber, IsString } from "class-validator";

export class UpdateStockDto{
    @IsString()
    productId: string;

    @IsNumber()
    quantity: number;    // quantity to reduce from stock
}