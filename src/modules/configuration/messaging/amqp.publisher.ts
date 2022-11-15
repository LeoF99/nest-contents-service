import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import AppLogger from '../logging/app.logger';

@Injectable()
export default class AmqpPublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly logger: AppLogger,
  ) {}

  public async publish(
    exchange: string,
    key: string,
    message: any,
  ): Promise<void> {
    try {
      await this.amqpConnection.publish(exchange, key, { data: message });
      this.logger.info(`Finished RabbitMQ Publisher - ${key}`);
    } catch (exception) {
      this.logger.error(
        `Failed publishing to ${exchange} (routingKey: ${key}) with: ${exception.message}`,
        exception.stack,
      );
      throw exception;
    }
  }
}
