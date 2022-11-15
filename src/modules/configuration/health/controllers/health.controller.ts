import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../../auth/public.decorator';

import CommitHashIndicator from '../commit-hash.indicator';

@Controller('health')
@Public()
export default class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private commitHash: CommitHashIndicator,
  ) {}

  @Get('liveness')
  @HealthCheck()
  liveness(): Promise<HealthCheckResult> {
    return this.health.check([() => this.commitHash.getHash('commitHash')]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.commitHash.getHash('commitHash'),
      () => this.db.pingCheck('database'),
    ]);
  }
}
