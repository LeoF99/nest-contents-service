import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import traceabilityMiddleware from '@sanardigital/traceability-middleware';

import OpenApiExceptionFilter from '../filters/openapi.filter';
import LoggingInterceptor from '../interceptors/logging.interceptor';
import MessageInterceptor from '../interceptors/message.interceptor';
import openapiValidatorMiddleware from '../middlewares/openapi.middleware';
import { ConfigurationModules } from './configuration';
import BoilerplateModule from './application/boilerplates/boilerplates.module';

@Module({
  imports: [...ConfigurationModules, BoilerplateModule],
  providers: [
    { provide: APP_FILTER, useClass: OpenApiExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: MessageInterceptor,
    },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(traceabilityMiddleware).forRoutes('*');
    consumer.apply(...openapiValidatorMiddleware).forRoutes('*');
  }
}
