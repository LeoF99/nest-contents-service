import { Global, Module } from '@nestjs/common';
import AppLogger from './app.logger';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
@Global()
export default class LoggingModule {}
