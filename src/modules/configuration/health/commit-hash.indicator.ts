import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export default class CommitHashIndicator extends HealthIndicator {
  async getHash(key: string): Promise<HealthIndicatorResult> {
    return this.getStatus(key, true, {
      commitHash: process.env.APPLICATION_VERSION,
    });
  }
}
