import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { API_KEY_AUTH_HEADER } from '../../../../configuration/auth/auth.strategy';
import controllerIntegrationTestModule from '../../../test/helpers/controllerIntTest.module';
import Boilerplate from '../../domain/boilerplate';
import BoilerplateService from '../../domain/boilerplates.service';
import { BoilerplatesController } from '../boilerplates.controller';

jest.mock('../../domain/boilerplates.service');

describe('BoilerplatesController', () => {
  let app: INestApplication;
  const BoilerplateServiceMock = BoilerplateService as jest.MockedClass<
    typeof BoilerplateService
  >;

  beforeAll(async () => {
    ({ app } = await controllerIntegrationTestModule(BoilerplatesController, [
      BoilerplateService,
    ]));
  });

  afterAll(async () => {
    app.close();
  });

  describe('POST /v1/boilerplates', () => {
    it('returns 201 and saved information', () => {
      const givenBody = {
        name: 'test',
      };

      BoilerplateServiceMock.prototype.create.mockResolvedValue(
        new Boilerplate({ id: 'uuid', name: 'test' }),
      );
      return request(app.getHttpServer())
        .post('/v1/boilerplates')
        .set(API_KEY_AUTH_HEADER, 'testapikey')
        .send(givenBody)
        .then((result) => {
          expect(result.status).toEqual(201);
          expect(result.body.id).toEqual('uuid');
          expect(result.body.name).toEqual('test');
        });
    });
  });
});
