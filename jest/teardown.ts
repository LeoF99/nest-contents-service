/* eslint-disable no-await-in-loop */
import * as child_process from 'child_process';
import { promisify } from 'util';

const exec = promisify(child_process.exec);

const stopDatabase = async (): Promise<void> => {
  process.stdout.write('Stopping test database...');
  await exec(`docker-compose down`);
};

module.exports = async () => {
  if (!process.env.CI) {
    await stopDatabase();
  }
};
