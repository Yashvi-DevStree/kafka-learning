/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConsumeTopicDto, CreateTopicDto, DeleteTopicDto, SendMessageDto } from './kafka.dto';

@Controller('kafka')
export class KafkaController {
    constructor(private readonly kafkaService: KafkaService) { }
    
    @Post('create-topic')
    async createTopic(@Body() dto: CreateTopicDto) {
        await this.kafkaService.connect();
        return this.kafkaService.createTopic(dto.name, dto.partitions || 1);
    }

    @Get('list-topics')
    async listTopics() {
        await this.kafkaService.connect();
        return this.kafkaService.listTopics();
    }

    @Delete('delete-topic')  
    async deleteTopic(@Body() dto: DeleteTopicDto) {
        await this.kafkaService.connect();
        return this.kafkaService.deleteTopic(dto.name);
    }

    @Post('send-message')
    async sendMessage(@Body() dto: SendMessageDto) {
        await this.kafkaService.connect();
        return this.kafkaService.sendMessage(dto.topic, dto.message);
    }
    
    @Post('consume-topic')
    async consumeTopic(@Body() dto: ConsumeTopicDto) {
        await this.kafkaService.connect();
        const messages = await this.kafkaService.consumeMessage(dto.topic, 2000);
        return { messages: messages };
    }
}