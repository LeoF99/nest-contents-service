import {
  Type,
  MiddlewareConsumer,
  NestModule,
  Module,
  Provider,
  INestApplication,
} from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import traceabilityMiddleware from '@sanardigital/traceability-middleware';

import setupApplication from '../../../../configuration/setupApplication';
import OpenApiExceptionFilter from '../../../../filters/openapi.filter';
import openapiValidatorMiddleware from '../../../../middlewares/openapi.middleware';
import AppLogger from '../../../configuration/logging/app.logger';
import AuthModule from '../../../configuration/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: globalThis.ENV_FILE }),
    AuthModule,
  ],
  providers: [
    AppLogger,
    { provide: APP_FILTER, useClass: OpenApiExceptionFilter },
  ],
})
class TestModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(traceabilityMiddleware).forRoutes('*');
    consumer
      .apply(...openapiValidatorMiddleware)
      .exclude('v1/authTest/(.*)')
      .forRoutes('*');
  }
}

const controllerIntegrationTestModule = async (
  Controller,
  providers?: Provider[],
  imports: Type<any>[] = [],
): Promise<{
  app: INestApplication;
}> => {
  const module = await Test.createTestingModule({
    imports: [...imports, TestModule],
    controllers: [Controller],
    providers,
  }).compile();

  const app = module.createNestApplication();
  await setupApplication(app);
  await app.init();

  return { app };
};

export default controllerIntegrationTestModule;
