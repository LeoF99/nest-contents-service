import { Histogram } from 'prom-client';

export default class RequestsHistogram extends Histogram<string> {
  private timer: any;

  public startTimer(): any {
    this.timer = super.startTimer();
    return this.timer;
  }

  public endTimer(route: string, method: string, statusCode: number): void {
    this.timer({
      route,
      method,
      statusCode,
    });
  }
}
