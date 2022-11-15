import { middleware } from 'express-openapi-validator';
import openapiDocument from '../docs/openapi';

const openapiValidatorMiddleware = middleware({
  apiSpec: openapiDocument as any,
  validateRequests: true,
  validateResponses: {
    removeAdditional: 'all',
  },
  validateFormats: 'full',
  validateSecurity: false,
  ignorePaths: /(metrics|health)/,
});

export default openapiValidatorMiddleware;
