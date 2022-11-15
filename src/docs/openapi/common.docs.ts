import { OpenAPIV3 } from 'openapi-types';

// eslint-disable-next-line import/prefer-default-export
export const paginatedResponseSchema = (
  ref: string,
): OpenAPIV3.SchemaObject => ({
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      items: {
        $ref: ref,
      },
    },
  },
});
