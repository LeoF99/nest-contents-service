import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';

import AppRabbitMQModule, { Exchanges, Queues } from '../rabbitmq.module';

describe('AppRabbitMQModule', () => {
  let module: TestingModule;
  let app: INestApplication;
  let connection;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppRabbitMQModule,
        ConfigModule.forRoot({ envFilePath: globalThis.ENV_FILE }),
      ],
    }).compile();
    app = module.createNestApplication();

    await app.init();

    connection = app.get(AmqpConnection);
    await new Promise<void>((resolve) =>
      connection.managedChannel.addSetup(() => {
        expect(connection.managedConnection.isConnected()).toEqual(true);
        resolve();
      }),
    );
  }, 15000);

  describe('onModuleInit', () => {
    it('creates exchanges if they dont exist', async () => {
      await expect(
        connection.channel.checkExchange(Exchanges.BOILERPLATE_NOTIFICATIONS),
      ).resolves.toEqual(expect.anything());

      await expect(
        connection.channel.checkExchange(Exchanges.BOILERPLATE_DLX_DEFAULT),
      ).resolves.toEqual(expect.anything());
    });

    it('creates a queue', async () => {
      await expect(
        connection.channel.checkQueue(`dlq.${Queues.BOILERPLATE_QUEUE}`),
      ).resolves.toEqual(expect.anything());
    });

    it('confirms that exchange has binded routing keys', async () => {
      await expect(
        connection.channel.deleteExchange(Exchanges.BOILERPLATE_DLX_DEFAULT, {
          ifUnused: true,
        }),
      ).rejects.toThrow();
    });
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });
});
