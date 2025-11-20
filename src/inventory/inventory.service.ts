/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class InventoryService {
    private readonly logger = new Logger(InventoryService.name);

    // Mock inventory storage
    private products = [
        { productId: 'p101', productName: 'Wireless Mouse', stock: 10 },
        { productId: 'p102', productName: 'Keyboard', stock: 15 },
        { productId: 'p103', productName: 'USB Headset', stock: 20 },
        { productId: 'p104', productName: 'Webcam HD', stock: 12 },
    ];

    getAllProducts() {
        return this.products;
    }

    getProductById(productId: string) {
        const product = this.products.find((p) => p.productId === productId);
        if (!product) throw new NotFoundException(`Product ${productId} not found`);
        return product;
    }

    updateStock(dto: UpdateStockDto) {
        const product = this.products.find((p) => p.productId === dto.productId);
        if (!product) throw new NotFoundException(`Product ${dto.productId} not found`);

        if (product.stock < dto.quantity) {
            throw new BadRequestException(`Insufficient stock for product ${dto.productId}`);
        }

        product.stock -= dto.quantity;
        this.logger.log(`Updated stock for ${product.productId}: ${product.stock}`);
        return product;
    }
}