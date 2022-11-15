import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import { CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, of, throwError } from 'rxjs';
import Prometheus from '../../modules/configuration/metrics/prometheus';
import PrometheusInterceptor from '../prometheus.interceptor';

jest.mock('@golevelup/nestjs-rabbitmq', () => ({
  isRabbitContext: jest.fn(),
}));

const request: Partial<Request> = {
  method: 'GET',
  url: '/v1/test/1',
  route: { path: '/v1/test/:id' },
};

const response: Partial<Response> = {
  statusCode: 201,
};

const executionContext = (type: string): any => ({
  getType: () => type,
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: jest.fn().mockReturnValue(request),
  getResponse: jest.fn().mockReturnValue(response),
});

const next: Partial<CallHandler> = {
  handle: jest.fn(),
};

describe('PrometheusInterceptor', () => {
  let interceptor: PrometheusInterceptor;
  let startTimerSpy;
  let endTimerSpy;

  beforeEach(() => {
    const requestStartTime = Date.now();
    const requestEndTime = requestStartTime + 15;
    Date.now = jest
      .fn()
      .mockReturnValueOnce(requestStartTime)
      .mockReturnValue(requestEndTime);

    const prometheus = new Prometheus();
    const histogram = prometheus.histogram();

    startTimerSpy = jest.spyOn(histogram, 'startTimer');
    endTimerSpy = jest.spyOn(histogram, 'endTimer');

    (next.handle as jest.Mock).mockReturnValue(of({ id: 1 }));

    interceptor = new PrometheusInterceptor(prometheus);
  });

  afterEach(() => {
    (Date.now as jest.Mock).mockClear();
  });

  describe('for HTTP context', () => {
    it('calls histogram startTime at request begin', () => {
      interceptor.intercept(executionContext('http') as any, next as any);

      expect(startTimerSpy).toHaveBeenCalled();
    });

    it('calls histogram endTimer when request ends succesfully', (done) => {
      const result: Observable<any> = interceptor.intercept(
        executionContext('http') as any,
        next as any,
      );

      result.subscribe({
        complete: () => {
          expect(endTimerSpy).toHaveBeenCalledWith(
            request.route.path,
            request.method,
            response.statusCode,
          );
          done();
        },
      });
    });

    it('calls histogram endTimer when request ends with error', (done) => {
      (next.handle as jest.Mock).mockImplementation(() =>
        throwError({ status: 500, stack: './file.js:30' }),
      );

      const result: Observable<any> = interceptor.intercept(
        executionContext('http') as any,
        next as any,
      );

      result.subscribe({
        error: () => {
          expect(endTimerSpy).toHaveBeenCalledWith(
            request.route.path,
            request.method,
            500,
          );
          done();
        },
      });
    });
  });

  describe('for non http context', () => {
    it('does not call any function from prometheus histogram', (done) => {
      const result: Observable<any> = interceptor.intercept(
        executionContext('ws') as any,
        next as any,
      );

      result.subscribe({
        complete: () => {
          expect(startTimerSpy).not.toHaveBeenCalled();
          expect(endTimerSpy).not.toHaveBeenCalled();
          expect(next.handle).toHaveBeenCalled();
          done();
        },
      });
    });

    it('returns next for rabbitMQ context', (done) => {
      (isRabbitContext as jest.Mock).mockImplementation(() => true);

      const result: Observable<any> = interceptor.intercept(
        executionContext('http') as any,
        next as any,
      );

      result.subscribe({
        complete: (): any => {
          expect(startTimerSpy).not.toHaveBeenCalled();
          expect(endTimerSpy).not.toHaveBeenCalled();
          expect(next.handle).toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
