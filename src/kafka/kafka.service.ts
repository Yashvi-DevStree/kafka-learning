/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
    private kafka = new Kafka({
        clientId: 'nestjs-kafka-client',
        brokers: ['localhost:9092'],
    });

    private producer: Producer = this.kafka.producer();
    private consumer: Consumer = this.kafka.consumer({ groupId: 'nestjs-consumer-group' });

    async onModuleInit() {
        // Connect producer on module init
        await this.producer.connect();
        console.log('Kafka Producer connected ✔');
    }

    // ---------------- TOPIC OPERATIONS ----------------

    async createTopic(name: string, partitions = 1) {
        return this.kafka.admin().createTopics({
            topics: [{ topic: name, numPartitions: partitions }],
        });
    }

    async listTopics() {
        return this.kafka.admin().listTopics();
    }

    async deleteTopic(name: string) {
        return this.kafka.admin().deleteTopics({
            topics: [name],
        });
    }

    // ---------------- MESSAGE OPERATIONS ----------------

    async sendMessage(topic: string, message: string) {
        await this.producer.send({
            topic,
            messages: [{ value: message }],
        });
    }

    async consumeMessage(topic: string, callback: (msg: string) => void) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value) callback(message.value.toString());
            },
        });
    }

    async connectConsumer() {
        await this.consumer.connect();
    }
}
