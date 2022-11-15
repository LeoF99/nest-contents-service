import { OpenAPIV3 } from 'openapi-types';

const errorSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer',
      description: 'HTTP status code returned',
    },
    error: {
      type: 'string',
      description: 'Type of HTTP Error',
    },
    message: {
      oneOf: [
        {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        {
          type: 'string',
        },
      ],
      description: 'Messages indicating the reason(s) of the failure',
    },
  },
};

export const errorResponses = {
  badRequestResponse: {
    description: "The request's syntax is not correct",
    content: {
      'application/json': {
        schema: errorSchema,
      },
    },
  },
  unauthorizedResponse: {
    description: 'The request is not authorized',
    content: {
      'application/json': {
        schema: errorSchema,
      },
    },
  },
  notFoundResponse: {
    description: 'The resourse is not found',
    content: {
      'application/json': {
        schema: errorSchema,
      },
    },
  },
  unprocessableEntityResponse: {
    description:
      'We could not process the request/entity even though its syntax is correct',
    content: {
      'application/json': {
        schema: errorSchema,
      },
    },
  },
  forbiddenResponse: {
    description: 'Client is not allowed to perform this operation',
    content: {
      'application/json': {
        schema: errorSchema,
      },
    },
  },
};

export default {
  errorResponses,
};
