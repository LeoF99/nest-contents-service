import { deploymentEnvironment, Environment } from '../deploymentEnvironment';

describe('deploymentEnvironment', () => {
  it('returns dev if no ENV_VAR environment variable is found', () => {
    expect(deploymentEnvironment()).toEqual(Environment.dev);
  });

  it('returns dev if ENV_VAR environment variable is found but does not match "app-<env>"', () => {
    process.env.ENVIRONMENT = 'infra-test';

    expect(deploymentEnvironment()).toEqual(Environment.dev);
  });

  it('returns dev if ENV_VAR environment variable matches "app-<env>" but env is not valid', () => {
    process.env.ENVIRONMENT = 'app-abobrinha';

    expect(deploymentEnvironment()).toEqual(Environment.dev);
  });

  it('returns environment if ENV_VAR environment variable matches "app-<env>" with a valid env', () => {
    process.env.ENVIRONMENT = 'dev';
    expect(deploymentEnvironment()).toEqual(Environment.dev);

    process.env.ENVIRONMENT = 'prod';
    expect(deploymentEnvironment()).toEqual(Environment.prod);
  });
});
