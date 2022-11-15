import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import CommitHashIndicator from './commit-hash.indicator';
import HealthController from './controllers/health.controller';

@Module({
  imports: [TerminusModule],
  providers: [CommitHashIndicator],
  controllers: [HealthController],
})
export default class HealthModule {}
