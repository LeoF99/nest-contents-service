import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { error } from 'express-openapi-validator';

@Catch(...Object.values(error))
export default class OpenApiExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.status).json({
      statusCode: exception.status,
      error: exception.name,
      message: exception.errors?.map((e) => `${e.path} ${e.message}`) || [],
    });
  }
}
