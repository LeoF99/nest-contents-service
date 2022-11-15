import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import PrometheusInterceptor from '../../../interceptors/prometheus.interceptor';
import MetricsController from './metrics.controller';
import Prometheus from './prometheus';

@Module({
  controllers: [MetricsController],
  providers: [
    Prometheus,
    {
      provide: APP_INTERCEPTOR,
      useClass: PrometheusInterceptor,
    },
  ],
})
export default class MetricsModule {}
