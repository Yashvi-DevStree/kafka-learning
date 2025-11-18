import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [KafkaModule, ProductsModule, OrderModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
