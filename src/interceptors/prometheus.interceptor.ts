import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import Prometheus from '../modules/configuration/metrics/prometheus';
import PrometheusHistogram from '../modules/configuration/metrics/requests.histogram';

@Injectable()
export default class PrometheusInterceptor implements NestInterceptor {
  private readonly histogram: PrometheusHistogram;

  constructor(private prometheus: Prometheus) {
    this.histogram = prometheus.histogram();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (isRabbitContext(context)) {
      return next.handle();
    }

    if (context.getType() === 'http') {
      const httpContext: HttpArgumentsHost = context.switchToHttp();
      const request = httpContext.getRequest<Request>();
      this.histogram.startTimer();

      return next.handle().pipe(
        tap(() => {
          this.histogram.endTimer(
            request.route.path,
            request.method,
            httpContext.getResponse().statusCode,
          );
        }),
        catchError((err) => {
          this.histogram.endTimer(
            request.route.path,
            request.method,
            err.status,
          );
          return throwError(err);
        }),
      );
    }
    return next.handle();
  }
}
