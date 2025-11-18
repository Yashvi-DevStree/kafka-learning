import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👉 Register global interceptor here
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new ErrorInterceptor(),
  )

  // connect kafka microservices (for consuming messages)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'nestjs-kafka-group',
      }
    }
  })
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log('NestJS Kafka Manager running on http://localhost:3000');

}
bootstrap();
