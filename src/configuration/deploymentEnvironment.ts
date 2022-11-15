export enum Environment {
  dev = 'dev',
  qa = 'qa',
  preprod = 'preprod',
  prod = 'prod',
}

export const deploymentEnvironment = (): Environment => {
  return (
    Environment[
      process.env.ENV_VAR?.match(/^app-(?<environment>\w+)$/)?.groups
        .environment
    ] || Environment.dev
  );
};
