import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { startUnleash, Unleash } from 'unleash-client';
import AppLogger from '../logging/app.logger';
import FeaturesService from './domain/features.service';

const unleashProvider = {
  provide: 'unleash',
  useFactory: async (
    configService: ConfigService,
    logger: AppLogger,
  ): Promise<Unleash> => {
    logger.info('Initializing unleash client.');
    return startUnleash({
      url: configService.get('UNLEASH_API_URL'),
      appName: 'default',
      environment: 'default',
      customHeaders: {
        Authorization: configService.get('UNLEASH_API_KEY'),
      },
    });
  },
  inject: [ConfigService, AppLogger],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FeaturesService, AppLogger, unleashProvider],
  exports: [FeaturesService],
})
export default class FeaturesModule {}
