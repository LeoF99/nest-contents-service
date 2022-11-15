import { CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import MessageInterceptor from '../message.interceptor';
import context, { TRACK_ID_KEY } from '@sanardigital/traceability-core';

jest.mock('@golevelup/nestjs-rabbitmq', () => ({
  isRabbitContext: jest.fn().mockReturnValue(true),
}));

const message = {
  fields: {
    routingKey: 'routing.key',
  },
  correlationId: '12345678',
};

const nestExecutionContext = (): any => ({
  getArgByIndex: jest
    .fn()
    .mockReturnValue({ properties: { correlationId: '12345678' } }),
});

const next: Partial<CallHandler> = {
  handle: jest.fn(),
};

describe('MessageInterceptor', () => {
  let interceptor: MessageInterceptor;
  let executeWithSpy;

  beforeEach(() => {
    interceptor = new MessageInterceptor();
    executeWithSpy = jest.fn().mockReturnValue(of({ id: 1 }));
    (next.handle as jest.Mock).mockReturnValue(of({ id: 1 }));
    context.execute = jest.fn().mockReturnValue({ with: executeWithSpy });
  });

  describe('for any context but RabbitMQ', () => {
    beforeEach(() => {
      (isRabbitContext as jest.Mock).mockImplementation(() => false);
    });

    it('calls next.handle for http context', (done) => {
      const result: Observable<any> = interceptor.intercept(
        nestExecutionContext() as any,
        next as any,
      );

      result.subscribe({
        complete: () => {
          expect(next.handle).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('for RabbitMQ context', () => {
    beforeEach(() => {
      (isRabbitContext as jest.Mock).mockImplementation(() => true);
    });
    it('sets trackId from message correlationId', (done) => {
      (next.handle as jest.Mock).mockImplementation(() => {
        return of({ id: 1 });
      });

      const result: Observable<any> = interceptor.intercept(
        nestExecutionContext() as any,
        next as any,
      );

      result.subscribe({
        complete: () => {
          expect(executeWithSpy).toHaveBeenCalledWith({
            [TRACK_ID_KEY]: message.correlationId,
          });
          expect(next.handle).toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
