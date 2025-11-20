import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka/kafka.service';
import { ProductsService } from './products/products.service';

import { InventoryService } from './inventory/inventory.service';
import { InventoryController } from './inventory/inventory.controller';

import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentConsumer } from './payment/payment.consumer';

import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrderConsumer } from './order/order.consumer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'nestjs-kafka-client',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'nestjs-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [InventoryController, PaymentController, OrderController, PaymentConsumer, OrderConsumer],
  providers: [
    KafkaService,
    ProductsService,
    InventoryService,
    PaymentService,
    OrderService,
  ],
})
export class AppModule { }
