import request from 'supertest';

describe('Mock e2e Test (for these, we should run against a real non prod environment)', () => {
  it('responds as healthy', async () => {
    return request(process.env.E2E_TEST_API_HOST)
      .get(`/v1/health/readiness`)
      .then((result) => {
        expect(result.status).toEqual(200);
      });
  });
});
