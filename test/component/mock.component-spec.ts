import request from 'supertest';

describe('Health (component test - for these, we should mock external dependencies)', () => {
  beforeAll(async () => {});

  it('GET /v1/health/readiness', async () => {
    return request(globalThis.app.getHttpServer())
      .get('/v1/health/readiness')
      .then((result) => {
        expect(result.status).toEqual(200);
      });
  });
});
