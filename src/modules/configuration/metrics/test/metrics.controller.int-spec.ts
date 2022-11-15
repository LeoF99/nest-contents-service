import { INestApplication } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import request from 'supertest';
import PrometheusInterceptor from '../../../../interceptors/prometheus.interceptor';
import controllerIntegrationTestModule from '../../../application/test/helpers/controllerIntTest.module';
import MetricsController from '../metrics.controller';
import Prometheus from '../prometheus';

describe('MetricsController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await controllerIntegrationTestModule(MetricsController, [
      Prometheus,
      {
        provide: APP_INTERCEPTOR,
        useClass: PrometheusInterceptor,
      },
    ]));
  });

  afterAll(async () => {
    app.close();
  });

  describe('GET /v1/metrics', () => {
    it('returns 200 with prometheus metrics', (done) => {
      request(app.getHttpServer())
        .get('/v1/metrics')
        .then((result) => {
          expect(result.status).toEqual(200);
          expect(result.text).toMatch(
            /# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds/,
          );
          done();
        });
    });
    it('returns http request metrics after a request made', (done) => {
      request(app.getHttpServer())
        .get('/v1/metrics')
        .then(() => {
          request(app.getHttpServer())
            .get('/v1/metrics')
            .then((result) => {
              expect(result.text).toMatch(
                /http_request_duration_seconds_bucket{le=.+,route="\/v1\/metrics",method="GET",statusCode="200",application="boilerplate-service",application_version="0.0.1",pod_id=.+,env=.+/,
              );
              expect(result.text).toMatch(
                /http_request_duration_seconds_sum{route="\/v1\/metrics",method="GET",statusCode="200",application="boilerplate-service",application_version="0.0.1",pod_id=.+,env=.+} \d\.\d+/,
              );
              expect(result.text).toMatch(
                /http_request_duration_seconds_count{route="\/v1\/metrics",method="GET",statusCode="200",application="boilerplate-service",application_version="0.0.1",pod_id=.+,env=.+} \d+/,
              );
              done();
            });
        });
    });
  });
});
