import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { Request, Response } from 'express';
import { createMock } from '@golevelup/nestjs-testing';

import { noticeError } from 'newrelic';
import LoggingInterceptor from '../logging.interceptor';
import AppLogger from '../../modules/configuration/logging/app.logger';

jest.mock('newrelic', () => ({
  noticeError: jest.fn(),
}));

// eslint-disable-next-line
const requestIp = require('request-ip');

const AppLoggerMock = AppLogger as jest.MockedClass<typeof AppLogger>;

jest.mock('request-ip', () => ({
  getClientIp: jest.fn().mockReturnValue('8.8.8.8'),
}));

const request: Partial<Request> = {
  method: 'POST',
  url: '/v1/test',
};

const response: Partial<Response> = {
  statusCode: 201,
};

const message = {
  fields: {
    exchange: 'boilerplate.notifications',
    routingKey: 'boilerplate.notifications.key',
  },
};

const executionContext = (type: string): ExecutionContext =>
  createMock<ExecutionContext>({
    getType: () => type,
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
    getArgByIndex: () => message,
  });

const next: Partial<CallHandler> = {
  handle: jest.fn(),
};

describe('LoggingInterceptor', () => {
  let mockedAppLogger: AppLogger;
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    const requestStartTime = Date.now();
    const requestEndTime = requestStartTime + 15;
    Date.now = jest
      .fn()
      .mockReturnValueOnce(requestStartTime)
      .mockReturnValue(requestEndTime);

    mockedAppLogger = new AppLoggerMock();
    mockedAppLogger.info = jest.fn();
    mockedAppLogger.error = jest.fn();

    interceptor = new LoggingInterceptor(mockedAppLogger);
    (next.handle as jest.Mock).mockReturnValue(of({ id: 1 }));
  });

  afterEach(() => {
    (Date.now as jest.Mock).mockClear();
    (noticeError as jest.Mock).mockClear();
  });

  describe('for HTTP context', () => {
    it('logs message with clientIp when request starts', () => {
      interceptor.intercept(executionContext('http') as any, next as any);

      expect(mockedAppLogger.info).toHaveBeenCalledWith({
        message:
          'Started Inbound HTTP Request POST /v1/test - [client: undefined]',
        clientIp: '8.8.8.8',
      });
    });

    it('logs message when request ends succesfully', (done) => {
      const result: Observable<any> = interceptor.intercept(
        executionContext('http') as any,
        next as any,
      );

      result.subscribe({
        complete: () => {
          expect(mockedAppLogger.info).toHaveBeenCalledTimes(2);
          expect(mockedAppLogger.info).toHaveBeenCalledWith(
            'Finished Inbound HTTP Request POST /v1/test in 15ms with status 201 - [client: undefined]',
          );
          done();
        },
      });
    });

    it('logs error message with trace when request ends with error', (done) => {
      (next.handle as jest.Mock).mockImplementation(() =>
        throwError({ status: 500, stack: './file.js:30' }),
      );

      const result: Observable<any> = interceptor.intercept(
        executionContext('http') as any,
        next as any,
      );

      result.subscribe({
        error: () => {
          expect(mockedAppLogger.error).toHaveBeenCalledTimes(1);
          expect(mockedAppLogger.error).toHaveBeenCalledWith(
            'Finished Inbound HTTP Request POST /v1/test in 15ms with status 500 - [client: undefined]',
            './file.js:30',
          );
          done();
        },
      });
    });

    it('notices error to new relic when request ends with error', (done) => {
      (next.handle as jest.Mock).mockImplementation(() =>
        throwError({ status: 500, stack: './file.js:30' }),
      );

      const result: Observable<any> = interceptor.intercept(
        executionContext('http') as any,
        next as any,
      );

      result.subscribe({
        error: () => {
          expect(noticeError).toHaveBeenCalledTimes(1);
          expect(noticeError).toHaveBeenCalledWith(
            { status: 500, stack: './file.js:30' },
            {
              errorMessage:
                'Finished Inbound HTTP Request POST /v1/test in 15ms with status 500 - [client: undefined]',
              stack: './file.js:30',
            },
          );
          done();
        },
      });
    });
  });

  describe('for RabbitMQ context', () => {
    it('logs message when subscriber starts', () => {
      interceptor.intercept(executionContext('rmq') as any, next as any);

      expect(mockedAppLogger.info).toHaveBeenCalledWith(
        'Started processing message from exchange boilerplate.notifications with routing key boilerplate.notifications.key',
      );
    });

    it('logs message when request ends succesfully', (done) => {
      const result: Observable<any> = interceptor.intercept(
        executionContext('rmq') as any,
        next as any,
      );

      result.subscribe({
        complete: () => {
          expect(mockedAppLogger.info).toHaveBeenCalledTimes(2);
          expect(mockedAppLogger.info).toHaveBeenCalledWith(
            'Finished processing message from exchange boilerplate.notifications with routing key boilerplate.notifications.key in 15ms',
          );
          done();
        },
      });
    });
  });

  describe('for non http and non rmq context', () => {
    it('does not log anything and calls next.handle', (done) => {
      const result: Observable<any> = interceptor.intercept(
        executionContext('ws') as any,
        next as any,
      );

      result.subscribe({
        complete: () => {
          expect(mockedAppLogger.info).not.toHaveBeenCalled();
          expect(mockedAppLogger.error).not.toHaveBeenCalled();
          expect(next.handle).toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
