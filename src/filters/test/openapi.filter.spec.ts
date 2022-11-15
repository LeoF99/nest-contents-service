import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import OpenApiExceptionFilter from '../openapi.filter';

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const executionContext: Partial<ArgumentsHost> = {
  switchToHttp: jest.fn().mockReturnValue({
    getResponse: jest.fn().mockReturnValue(response),
  }),
};

describe('OpenApiExceptionFilter', () => {
  const filter = new OpenApiExceptionFilter();
  const error = {
    status: 400,
    name: 'BadRequest',
    path: 'body',
    errors: [
      {
        path: 'body.name',
        message: 'should have required field name',
      },
      {
        path: 'body.date',
        message: 'should be a date',
      },
    ],
  };

  describe('catch', () => {
    it('uses the exception status as the response status code', () => {
      filter.catch(error, executionContext as ArgumentsHost);

      expect(response.status).toBeCalledWith(error.status);
    });

    it('maps all errors as message in JSON response if exception error has errors ', () => {
      filter.catch(error, executionContext as ArgumentsHost);

      expect(response.json).toBeCalledWith({
        statusCode: error.status,
        error: error.name,
        message: [
          'body.name should have required field name',
          'body.date should be a date',
        ],
      });
    });

    it('sends empty message array in JSON response if exception error has no defined errors', () => {
      filter.catch(
        { ...error, errors: undefined },
        executionContext as ArgumentsHost,
      );

      expect(response.json).toBeCalledWith({
        statusCode: error.status,
        error: error.name,
        message: [],
      });
    });
  });
});
