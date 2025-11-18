/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Admin, Consumer, Kafka, logLevel, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit{

    private kafka: Kafka;
    private admin: Admin;
    private producer: Producer;
    private consumer: Consumer;

    onModuleInit() {
        this.kafka = new Kafka({
            clientId: 'nestjs-kafka-client',
            brokers: ['localhost:9092'],
            logLevel: logLevel.INFO,
        });

        this.admin = this.kafka.admin();
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'nestjs-consumer-group' });
    }

    async connect() {
        await this.admin.connect();
        await this.producer.connect();
        await this.consumer.connect();
    }

    // create a topic
    async createTopic(topic: string, numPartitions = 1) {
        const exists = await this.admin.listTopics();
        if (exists.includes(topic)) throw new Error(`Topic "${topic}" already exists.`);
        return this.admin.createTopics({
            topics: [{ topic, numPartitions }],
        });
    }

    // list all topics
    listTopics() {
        return this.admin.listTopics();
    }

    // Delete a topic
    async deleteTopic(topic: string) {
        const exists = await this.admin.listTopics();
        if (!exists.includes(topic)) throw new Error(`Topic "${topic}" does not exist.`);
        return this.admin.deleteTopics({ topics: [topic] });
    } 

    // Produce a messsage
    sendMessage(topic: string, message: string) {
        return this.producer.send({
            topic,
            messages: [{ value: message }],
        })
    }

    // consume message for x seconds
    async consumeMessage(topic: string, durationMs: number = 2000): Promise<string[]>{
        const messages: string[] = [];

        await this.consumer.subscribe({ topic, fromBeginning: true });

        await this.consumer.run({
            eachMessage: async ({ message }) => {
                const value = message.value ? message.value.toString() : '';
                messages.push(value);
            }
        })

        await new Promise((resolve) => setTimeout(resolve, durationMs));
        await this.consumer.stop();
        return messages;
    }

}
