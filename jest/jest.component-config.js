/* eslint-disable @typescript-eslint/no-var-requires */
const defaultConfig = require('./jest.config.js');

module.exports = {
  ...defaultConfig,
  rootDir: '../test/component',
  testRegex: '.component-spec.ts$',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  globalSetup: '../../jest/setup.ts',
  globalTeardown: '../../jest/teardown.ts',
};
