import { Test } from '@nestjs/testing';
import { startUnleash } from 'unleash-client';
import setupApplication from '../../src/configuration/setupApplication';
import AppModule from '../../src/modules/app.module';

jest.mock('unleash-client');
(startUnleash as jest.Mock).mockResolvedValue({
  isEnabled: jest.fn().mockReturnValue(true),
});

global.beforeAll(async () => {
  const appModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = appModule.createNestApplication();
  await setupApplication(app);
  await app.init();
  globalThis.app = app;
}, 50000);

global.afterAll(async () => {
  try {
    await globalThis?.app?.close();
  } catch (error) {
    console.error(error);
  }
}, 50000);
