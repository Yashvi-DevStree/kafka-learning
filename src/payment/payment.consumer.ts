/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Controller, Logger } from "@nestjs/common";
import { PaymentService } from './payment.service';
import { KafkaService } from "src/kafka/kafka.service";
import { Ctx, KafkaContext, MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class PaymentConsumer{
    private readonly logger = new Logger(PaymentConsumer.name);

    constructor(
        private readonly paymentService: PaymentService,
        private readonly kafkaService: KafkaService
    ) { }

    // Listen for payment request coming from order service
    @MessagePattern('payment.request')
    async handlePaymentRequest(@Payload() data: any, @Ctx() context: KafkaContext) {
        this.logger.log(`Received payment.request: ${JSON.stringify(data)}`);
        const { orderId, amount, paymentMethod } = data;

        // Process payment
        const paymentResult = await this.paymentService.processPayment(orderId, amount, paymentMethod);

        // Publish completed event
        this.kafkaService.emit('payment.completed', paymentResult);
        return paymentResult;
    }
}