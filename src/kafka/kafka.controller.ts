/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
    constructor(private readonly kafkaService: KafkaService) { }

    // ---------------- TOPIC ROUTES ----------------

    @Post('create-topic')
    async createTopic(@Body() dto: { name: string; partitions?: number }) {
        const result = await this.kafkaService.createTopic(dto.name, dto.partitions);
        return { error: false, message: 'Topic created successfully', data: result };
    }

    @Get('list-topics')
    async listTopics() {
        const topics = await this.kafkaService.listTopics();
        return { error: false, message: 'Topics retrieved', data: topics };
    }

    @Delete('delete-topic/:name')
    async deleteTopic(@Param('name') name: string) {
        const result = await this.kafkaService.deleteTopic(name);
        return { error: false, message: 'Topic deleted', data: result };
    }

    // ---------------- MESSAGE ROUTES ----------------

    @Post('send-message')
    async sendMessage(@Body() dto: { topic: string; message: string }) {
        await this.kafkaService.sendMessage(dto.topic, dto.message);
        return { error: false, message: 'Message sent successfully', data: null };
    }

    @Post('consume-message')
    async consumeMessage(@Body() dto: { topic: string }) {
        const messages: string[] = [];
        await this.kafkaService.connectConsumer();
        await this.kafkaService.consumeMessage(dto.topic, (msg) => messages.push(msg));
        return { error: false, message: 'Messages consumed', data: messages };
    }
}