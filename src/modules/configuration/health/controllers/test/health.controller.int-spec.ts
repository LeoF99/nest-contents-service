import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus/dist/health-indicator/database/typeorm.health';
import CommitHashIndicator from '../../commit-hash.indicator';
import HealthController from '../health.controller';
import controllerIntegrationTestModule from '../../../../application/test/helpers/controllerIntTest.module';

jest.mock('../../commit-hash.indicator');
jest.mock('@nestjs/terminus/dist/health-indicator/database/typeorm.health');
CommitHashIndicator.prototype.getHash = jest.fn().mockReturnValue({
  commitHash: '123abc',
});
TypeOrmHealthIndicator.prototype.pingCheck = jest
  .fn()
  .mockReturnValue({ database: { status: 'up' } });

describe('HealthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await controllerIntegrationTestModule(
      HealthController,
      [CommitHashIndicator],
      [TerminusModule],
    ));
  });

  afterAll(async () => {
    app.close();
  });

  describe('GET /v1/health/liveness', () => {
    it('returns 200 with health information', () => {
      return request(app.getHttpServer())
        .get('/v1/health/liveness')
        .then((result) => {
          expect(result.status).toEqual(200);
          expect(result.body.status).toEqual('ok');
          expect(result.body.info).toEqual({ commitHash: '123abc' });
          expect(result.body.error).toEqual({});
          expect(result.body.details).toEqual({ commitHash: '123abc' });
        });
    });
  });

  describe('GET /v1/health/readiness', () => {
    it('returns 200 with health information', () => {
      return request(app.getHttpServer())
        .get('/v1/health/readiness')
        .then((result) => {
          expect(result.status).toEqual(200);
          expect(result.body.status).toEqual('ok');
          expect(result.body.info).toEqual({
            commitHash: '123abc',
            database: { status: 'up' },
          });
          expect(result.body.error).toEqual({});
          expect(result.body.details).toEqual({
            commitHash: '123abc',
            database: { status: 'up' },
          });
        });
    });
  });
});
