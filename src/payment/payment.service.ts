/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PaymentDto, PaymentMethod } from './dto/payment.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentService {

    processPayment(orderId: string, amount: number, paymentMethod: PaymentMethod): PaymentDto {
        const transactionId = randomUUID();

        const status = paymentMethod === PaymentMethod.COD ? 'PENDING' : 'SUCCESS';

        const response: PaymentDto = {
            orderId,
            amount,
            paymentMethod,
            transactionId,
            status,
            timestamp: new Date()
        };

        return response;
    }
}
