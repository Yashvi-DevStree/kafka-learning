import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { KafkaService } from 'src/kafka/kafka.service';
import { ProductsService } from 'src/products/products.service';
import { InventoryService } from 'src/inventory/inventory.service';

@Module({
  providers: [OrderService, KafkaService, ProductsService, InventoryService],
  controllers: [OrderController],
})
export class OrderModule {}
