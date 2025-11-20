/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable, NotFoundException } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';
import { ProductsService } from 'src/products/products.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStockDto } from 'src/inventory/dto/update-stock.dto';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentDto, PaymentMethod } from 'src/payment/dto/payment.dto';
import { randomUUID } from 'crypto';

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
    paymentMethod: PaymentMethod;
    paymentStatus: string;
    transactionId: string;
    paymentTimestamp: Date;   // percona 
};

@Injectable()
export class OrderService {
    private orders: Order[] = [];

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly productsService: ProductsService,
        private readonly inventoryService: InventoryService,
        private readonly paymentService: PaymentService,
    ) { }

    // create order, reduce stock, trigger payment request (if not COD)
    async createOrder(dto: CreateOrderDto) {
        let totalAmount = 0;

        const orderItems: OrderItem[] = [];

        for (const item of dto.items) {
            const product = this.productsService.getById(item.productId);
            if (!product) {
                throw new NotFoundException(`Product not found: ${item.productId}`);
            }

            // Reduce stock using your inventory service
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

        const orderId = randomUUID();
        const order: Order = {
            id: orderId,
            customerName: dto.customerName,
            customerEmail: dto.customerEmail,
            items: orderItems,
            totalAmount,
            status: dto.paymentMethod === PaymentMethod.COD ? 'PENDING_COD' : 'PENDING',
            paymentMethod: dto.paymentMethod,
            createdAt: new Date(),
            paymentStatus: '',
            transactionId: '',
            paymentTimestamp: null
        };

        this.orders.push(order);

        // publish order_created
        this.kafkaService.emit('order_created', order);

        // if ONLINE payment , request payment processing
        if (dto.paymentMethod !== PaymentMethod.COD) {
            this.kafkaService.emit('payment.request', {
                orderId,
                amount: totalAmount,
                paymentMethod: PaymentMethod,
            });
        }

        return { message: 'Order created successfully', order }; 
    }

    // ------------------ GET ALL ORDERS ------------------ //
    getAll() {
        return {
            count: this.orders.length,
            orders: this.orders,
        };
    }

    // ------------------ GET BY ID ------------------ //
    getOrderById(id: string) {
        const order = this.orders.find((o) => o.id === id);
        if (!order) throw new NotFoundException(`Order: ${id} not found`);
        return order;
    }

    // ------------------ UPDATE STATUS ------------------ //
    async updateStatus(id: string, status: string) {
        const order = this.orders.find((o) => o.id === id);
        if (!order) throw new NotFoundException(`Order not found: ${id}`);
        order.status = status;
        this.kafkaService.emit('order_status_updated', { id, status });
        return { message: "Order status updated", order };
    }

    // called when payment.completed is received by consumer (see order.consumer)
    applyPaymentResult(payment: PaymentDto) {
        const order = this.orders.find((o) => o.id === payment.orderId);
        if (!order) return null;

        order.paymentStatus = payment.status;
        order.transactionId = payment.transactionId;
        order.paymentTimestamp = payment.timestamp;

        order.status = payment.status === 'SUCCESS'
            ? 'CONFIRMED'
            : 'PAYMENT_FAILED';
        
        return order;
    }
}