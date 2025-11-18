/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    createOrder(@Body() dto: CreateOrderDto) {
        return this.orderService.createOrder(dto);
    }

    @Get()
    getAllOrders() {
        return this.orderService.getAll();
    }

    @Get(':id')
    getOrderById(@Param('id') id: string) {
        return this.orderService.getOrderById(id);
    }

    @Patch('status/:id')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') body: { status: string }
    ) { 
        return this.orderService.updateStatus(id, body.status);
    }
}
