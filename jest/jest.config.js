module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../src',
  testRegex: '.*\\.spec\\.ts$',
  globals: {
    ENV_FILE: 'environments/.env.test',
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/test/**'],
  coveragePathIgnorePatterns: [
    '/src/docs/',
    '/src/migrations/',
    '.module.ts',
    '/src/jobs/',
  ],
  coverageDirectory: '../coverage/unit',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['../jest/jest.setup.ts'],
};
