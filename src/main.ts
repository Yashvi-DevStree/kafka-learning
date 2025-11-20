import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';

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
        groupId: 'nestjs-consumer-group',
      }
    }
  })
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log('NestJS Kafka Manager running on http://localhost:3000');

}
bootstrap();