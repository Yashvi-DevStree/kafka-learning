/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
    private products = [
        { id: 'p101', name: 'Wireless Mouse', price: 499 },
        { id: 'p102', name: 'Keyboard', price: 799 },
        { id: 'p103', name: 'USB Headset', price: 1299 },
        { id: 'p104', name: 'Webcam HD', price: 1599 },
    ];

    getAll() {
        return this.products;
    }

    getById(id: string) {
        return this.products.find((p) => p.id === id);
    }

    // Auto generated new products
    createProduct(name: string, price: number) {
        const id = `P${Math.floor(100 + Math.random() * 900)}`;
        const newProduct = { id, name, price };
        this.products.push(newProduct);
        return newProduct;
    }
}
