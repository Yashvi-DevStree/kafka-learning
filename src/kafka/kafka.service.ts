/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        // If you want request-response style, subscribe to response topics here
        // Connect client
        await this.kafkaClient.connect();
        console.log('ClientKafka connected');
    }

    // emit an event (fire-and-forget)
    emit(topic: string, payload: any) {
        // returns an Observable; we don't await here (fire-and-forget)
        this.kafkaClient.emit(topic, payload);
    }

    // send (request-response) - returns Observable
    send(pattern: string, payload: any) {
        return this.kafkaClient.send(pattern, payload);
    }
}