import { Global, Module } from '@nestjs/common';
import AppLogger from '../logging/app.logger';
import AmqpPublisher from './amqp.publisher';
import AppRabbitMQModule from './rabbitmq.module';

@Module({
  imports: [AppRabbitMQModule],
  providers: [AmqpPublisher, AppLogger],
  exports: [AmqpPublisher],
})
@Global()
export default class MessagingModule {}
