import { serve, setup } from 'swagger-ui-express';
import * as express from 'express';
import { join } from 'path';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import openapiDocument from '../docs/openapi';
import AppLogger from '../modules/configuration/logging/app.logger';
import { deploymentEnvironment, Environment } from './deploymentEnvironment';

const GLOBAL_PREFIX = 'v1';

const setupApplication = async (app: INestApplication): Promise<void> => {
  if (![Environment.prod].includes(deploymentEnvironment())) {
    app.use('/api-docs', serve, setup(openapiDocument));
  }
  app.use(
    '/asyncapi-docs',
    express.static(join(__dirname, '../docs/asyncapi/page')),
  );
  app.enableShutdownHooks();
  app.useLogger(app.get(AppLogger));
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
};

export default setupApplication;
