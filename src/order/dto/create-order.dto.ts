/* eslint-disable prettier/prettier */
import { IsString, ValidateNested, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from 'src/payment/dto/payment.dto';

class OrderItemDto {
    @IsString()
    productId: string;

    // qty is number but validating only with transform when needed
    qty: number;
}

export class CreateOrderDto {
    @IsString()
    customerName: string;

    @IsString()
    customerEmail: string;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
