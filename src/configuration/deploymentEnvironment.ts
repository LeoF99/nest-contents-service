export enum Environment {
  dev = 'dev',
  prod = 'prod',
}

export const deploymentEnvironment = (): Environment => {
  return Environment[process.env.ENVIRONMENT] || Environment.dev;
};
