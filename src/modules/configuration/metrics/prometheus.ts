import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  DefaultMetricsCollectorConfiguration,
  register,
  Registry,
} from 'prom-client';
import RequestsHistogram from './requests.histogram';

@Injectable()
export default class Prometheus {
  private register: Registry;

  private requestsHistogram: RequestsHistogram;

  constructor() {
    const registry = register;
    registry.clear();

    registry.setDefaultLabels({
      application: process.env.npm_package_name,
      application_version: process.env.npm_package_version,
      pod_id: `${process.env.POD_ID}`,
      env: `${process.env.ENV_VAR}`,
    });

    const defaultMetricsOptions: DefaultMetricsCollectorConfiguration = {
      register: registry,
    };

    collectDefaultMetrics(defaultMetricsOptions);
    this.collectAppMetrics(registry);
    this.register = registry;
  }

  public metrics(): Promise<string> {
    return this.register.metrics();
  }

  public getMetric = (name: string): Promise<string> => {
    return this.register.getSingleMetricAsString(name);
  };

  public histogram = (): RequestsHistogram => {
    return this.requestsHistogram;
  };

  private collectAppMetrics(registry: Registry): void {
    this.requestsHistogram = new RequestsHistogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in milliseconds',
      labelNames: ['method', 'route', 'statusCode'],
    });
    registry.registerMetric(this.requestsHistogram);
  }
}
