import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { noticeError } from 'newrelic';
import AppLogger from '../modules/configuration/logging/app.logger';

// eslint-disable-next-line
const requestIp = require('request-ip');

@Injectable()
export default class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType<'http' | 'rmq'>();

    if (contextType === 'rmq') {
      const requestStart = Date.now();
      const { routingKey, exchange } = context.getArgByIndex(1).fields;
      this.logger.info(
        `Started processing message from exchange ${exchange} with routing key ${routingKey}`,
      );

      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.info(
              `Finished processing message from exchange ${exchange} with routing key ${routingKey} in ${
                Date.now() - requestStart
              }ms`,
            ),
          ),
        );
    }

    if (context.getType() === 'http') {
      const requestStart = Date.now();
      const httpContext: HttpArgumentsHost = context.switchToHttp();
      const request = httpContext.getRequest<Request>();
      this.logRequestStart(request);

      return next.handle().pipe(
        tap(() =>
          this.logRequestEnd(request, httpContext.getResponse(), requestStart),
        ),
        catchError((err) => {
          this.logRequestError(request, err, requestStart);
          return throwError(err);
        }),
      );
    }
    return next.handle();
  }

  private logRequestStart(request: Request): void {
    this.logger.info({
      message: `Started Inbound HTTP Request ${request.method} ${request.url} - [client: ${request.user}]`,
      clientIp: requestIp.getClientIp(request),
    });
  }

  private logRequestEnd(
    request: Request,
    response: Response,
    requestStart: number,
  ): void {
    const elapsedTime = Date.now() - requestStart;
    this.logger.info(
      `Finished Inbound HTTP Request ${request.method} ${request.url} in ${elapsedTime}ms with status ${response.statusCode} - [client: ${request.user}]`,
    );
  }

  private logRequestError(request: Request, error, requestStart: number): void {
    const elapsedTime = Date.now() - requestStart;
    const errorMessage = `Finished Inbound HTTP Request ${request.method} ${request.url} in ${elapsedTime}ms with status ${error.status} - [client: ${request.user}]`;
    this.logger.error(errorMessage, error.stack);
    if (error.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      noticeError(error, { errorMessage, stack: error.stack });
    }
  }
}
