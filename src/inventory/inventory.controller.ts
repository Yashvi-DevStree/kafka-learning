/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }
    
    @Get('products')
    getAllProducts() {
        return this.inventoryService.getAllProducts();
    }

    @Patch('update-stock')
    updateStock(@Body() dto: UpdateStockDto) {
        return this.inventoryService.updateStock(dto);
    }
}
