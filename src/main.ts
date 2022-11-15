import { NestFactory } from '@nestjs/core';
import AppModule from './modules/app.module';
import setupApplication from './configuration/setupApplication';

if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await setupApplication(app);
  app.listen(3000);
}
bootstrap();
