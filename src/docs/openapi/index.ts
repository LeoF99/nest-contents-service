import { OpenAPIV3 } from 'openapi-types';

import { errorResponses } from './errors.docs';

const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.1',
  info: {
    description: "OpenAPI doc for Sanar's x service",
    version: 'v1',
    title: 'X Service',
  },
  servers: [
    {
      url: '/v1',
    },
  ],
  paths: {
    '/boilerplates': {
      post: {
        tags: ['Boilerplates'],
        summary: 'Boilerplate creation',
        operationId: 'create',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of the boilerplate',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Boilerplate succesfully created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id', 'name'],
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Id',
                    },
                    name: {
                      type: 'string',
                      description: 'Name',
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/badRequestResponse',
          },
          401: {
            $ref: '#/components/responses/unauthorizedResponse',
          },
          422: {
            $ref: '#/components/responses/unprocessableEntityResponse',
          },
        },
      },
    },
  },
  components: {
    schemas: {},
    responses: {
      ...errorResponses,
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
      },
    },
  },
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
};

export default swaggerDocument;
