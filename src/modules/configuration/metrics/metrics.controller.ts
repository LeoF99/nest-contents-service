import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import Prometheus from './prometheus';

@Controller('metrics')
@Public()
export default class MetricsController {
  constructor(private prometheus: Prometheus) {}

  @Get()
  metrics(): Promise<string> {
    return this.prometheus.metrics();
  }
}
