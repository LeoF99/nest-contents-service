import {
  AmqpConnection,
  MessageHandlerErrorBehavior,
  RabbitMQConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppLogger from '../logging/app.logger';

enum Exchanges {
  BOILERPLATE_DLX_DEFAULT = `boilerplate.dead.letter.exchange`,
  BOILERPLATE_NOTIFICATIONS = 'boilerplate.notifications',
}

enum Queues {
  BOILERPLATE_QUEUE = 'boilerplate.notifications.queue',
}

enum RoutingKeys {
  KEY = 'boilerplate.notifications.key',
}

export const rabbitMQModuleFactory = (
  configService: ConfigService,
): RabbitMQConfig => ({
  exchanges: [
    {
      name: Exchanges.BOILERPLATE_NOTIFICATIONS,
      type: 'topic',
    },
    {
      name: Exchanges.BOILERPLATE_DLX_DEFAULT,
      type: 'topic',
    },
  ],
  uri: configService.get('RABBIT_MQ_URI'),
  connectionInitOptions: {
    timeout: 20000,
    wait: !!configService.get('RABBIT_MQ_WAIT_UNTIL_CONNECTED') || false,
  },
  defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
});

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: rabbitMQModuleFactory,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [AppLogger],
  exports: [RabbitMQModule],
})
export default class AppRabbitMQModule implements OnModuleInit {
  constructor(
    private amqpConnection: AmqpConnection,
    private logger: AppLogger,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      return this.amqpConnection.managedChannel.addSetup(async (channel) => {
        return Promise.all(
          Object.values(Queues).map(async (queue) => {
            const dlq = `dlq.${queue}`;
            await channel.assertQueue(dlq, { durable: true });
            await channel.bindQueue(
              dlq,
              Exchanges.BOILERPLATE_DLX_DEFAULT,
              queue,
            );
          }),
        );
      });
    } catch (exception) {
      this.logger.error(
        `Failed creating queue with: ${exception.message}`,
        exception.stack,
      );
    }
  }
}

export { Exchanges, Queues, RoutingKeys };
