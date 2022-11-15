import { Controller, Get, INestApplication } from '@nestjs/common';
import request from 'supertest';

import controllerIntegrationTestModule from '../../../application/test/helpers/controllerIntTest.module';
import { API_KEY_AUTH_HEADER } from '../auth.strategy';
import { Public } from '../public.decorator';

@Controller('authTest')
class TestController {
  @Get('public')
  @Public()
  async public(): Promise<string> {
    return 'this is a public route';
  }

  @Get('private')
  async private(): Promise<string> {
    return 'this is a private route';
  }
}

describe('AuthModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await controllerIntegrationTestModule(TestController));
  });

  afterAll(async () => {
    app.close();
  });

  it('returns sucessful response if the route is public and request has no X-API-KEY header', () => {
    return request(app.getHttpServer())
      .get('/v1/authTest/public')
      .then((result) => {
        expect(result.status).toEqual(200);
      });
  });

  it('returns 401 response if the route is private and request has no X-API-KEY header', () => {
    return request(app.getHttpServer())
      .get('/v1/authTest/private')
      .then((result) => {
        expect(result.status).toEqual(401);
      });
  });

  it('returns 401 response if the route is private and request has an invalid X-API-KEY header', () => {
    return request(app.getHttpServer())
      .get('/v1/authTest/private')
      .set(API_KEY_AUTH_HEADER, 'invalid')
      .then((result) => {
        expect(result.status).toEqual(401);
      });
  });

  it('returns sucessful response if the route is private and request has valid X-API-KEY header', () => {
    return request(app.getHttpServer())
      .get('/v1/authTest/private')
      .set(API_KEY_AUTH_HEADER, 'testapikey')
      .then((result) => {
        expect(result.status).toEqual(200);
      });
  });
});
