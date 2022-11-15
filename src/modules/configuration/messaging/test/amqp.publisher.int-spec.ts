import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import context from '@sanardigital/traceability-core';
import MessagingModule from '../messaging.module';
import AppRabbitMQModule, { Exchanges, RoutingKeys } from '../rabbitmq.module';
import AmqpPublisher from '../amqp.publisher';

jest.mock('@sanardigital/traceability-core');

describe('AmqpPublisher', () => {
  let publisher: AmqpPublisher;
  let module: TestingModule;
  let connection: AmqpConnection;
  const correlationId = '111-222-v4-3333';

  const messageData = {
    message: {
      content: 'test',
    },
    key: RoutingKeys.KEY,
    exchange: Exchanges.BOILERPLATE_NOTIFICATIONS,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: globalThis.ENV_FILE }),
        AppRabbitMQModule,
        MessagingModule,
      ],
    }).compile();
    publisher = module.get(AmqpPublisher);
    connection = module.get(AmqpConnection);
    context.getTrackId = jest.fn().mockReturnValue(correlationId);
    expect(connection.managedConnection.isConnected()).toEqual(true);
  }, 10000);

  describe('publish', () => {
    it('publishs a message to the queue with right body and as persistent and correlationId', (done) => {
      const persistentMessageDeliveryMode = 2;
      const handler = (msg, options): any => {
        expect(msg.data).toEqual(messageData.message);
        expect(options.properties.deliveryMode).toEqual(
          persistentMessageDeliveryMode,
        );
        expect(options.properties.correlationId).toEqual(correlationId);
        done();
      };

      connection
        .createSubscriber(
          handler,
          {
            exchange: messageData.exchange,
            routingKey: messageData.key,
          },
          'unknown',
        )
        .then(() => {
          publisher.publish(
            messageData.exchange,
            messageData.key,
            messageData.message,
          );
        });
    });

    it('throws when could not publish a message to the queue', async () => {
      await connection.managedConnection.close();

      await expect(
        publisher.publish(
          messageData.exchange,
          messageData.key,
          messageData.message,
        ),
      ).rejects.toThrow();
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
