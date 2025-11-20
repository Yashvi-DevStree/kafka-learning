import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { KafkaService } from 'src/kafka/kafka.service';
import { PaymentConsumer } from './payment.consumer';

@Module({
  providers: [PaymentService, KafkaService],
  controllers: [PaymentController, PaymentConsumer],
})
export class PaymentModule { }
