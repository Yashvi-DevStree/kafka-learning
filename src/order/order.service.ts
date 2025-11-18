/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';
import { ProductsService } from 'src/products/products.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStockDto } from 'src/inventory/dto/update-stock.dto';

type OrderItem = {
    productId: string;
    productName: string;
    price: number;
    qty: number;
    lineTotal: number;
};

type Order = {
    id: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: Date;
};

@Injectable()
export class OrderService {
    private orders: Order[] = [];

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly productsService: ProductsService,
        private readonly inventoryService: InventoryService,
    ) { }

    // ------------------ CREATE ORDER ------------------ //
    async createOrder(dto: CreateOrderDto) {
        let totalAmount = 0;

        const orderItems: OrderItem[] = [];

        for (const item of dto.items) {
            // get product details
            const product = this.productsService.getById(item.productId);
            if (!product) {
                throw new NotFoundException(`Product not found: ${item.productId}`);
            }

            // check and reduce stock
            const stockDto: UpdateStockDto = { productId: product.id, quantity: item.qty };
            this.inventoryService.updateStock(stockDto);

            const lineTotal = product.price * item.qty;
            totalAmount += lineTotal;

            orderItems.push({
                productId: product.id,
                productName: product.name,
                price: product.price,
                qty: item.qty,
                lineTotal,
            });
        }

        const order: Order = {
            id: Date.now().toString(),
            customerName: dto.customerName,
            customerEmail: dto.customerEmail,
            items: orderItems,
            totalAmount,
            status: 'PENDING',
            createdAt: new Date(),
        };

        this.orders.push(order);

        // publish kafka event
        await this.kafkaService.sendMessage('order_created', JSON.stringify(order));

        return { message: 'Order created successfully', order };
    }

    // ------------------ GET ALL ORDERS ------------------ //
    getAll() {
        return {
            count: this.orders.length,
            orders: this.orders,
        };
    }

    // ------------------ GET ORDER BY ID ------------------ //
    getOrderById(id: string) {
        const order = this.orders.find((o) => o.id === id);
        if (!order) throw new NotFoundException(`Order: ${id} not found`);
        return order;
    }

    // ------------------ UPDATE ORDER STATUS ------------------ //
    async updateStatus(id: string, status: string) {
        const order = this.orders.find((o) => o.id === id);
        if (!order) throw new NotFoundException(`Order: ${id} not found`);

        order.status = status;

        // publish event
        await this.kafkaService.sendMessage(
            "order_status_updated",
            JSON.stringify({ id, status }),
        );
        return { message: "Order status updated" };
    }
}