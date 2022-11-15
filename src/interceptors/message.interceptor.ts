import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import context, { TRACK_ID_KEY } from '@sanardigital/traceability-core';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable()
export default class MessageInterceptor implements NestInterceptor {
  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    if (isRabbitContext(executionContext)) {
      const { properties } = executionContext.getArgByIndex(1);
      return from(
        context
          .execute(async () => lastValueFrom(next.handle()))
          .with({
            [TRACK_ID_KEY]: properties.correlationId,
          }),
      );
    }
    return next.handle();
  }
}
