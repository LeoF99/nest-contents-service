import winston from 'winston';
import { Injectable, LoggerService } from '@nestjs/common';
import newrelicFormatter from '@newrelic/winston-enricher';

const isProduction = process.env.NODE_ENV === 'production';

@Injectable()
export default class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(...this.getFormats()),
      defaultMeta: this.getDefaultMeta(),
      transports: [new winston.transports.Console()],
    });
  }

  error(message: any, trace?: string): void {
    this.logger.error({ message, trace });
  }

  log(message: any): void {
    this.logger.info(message);
  }

  warn(message: any): void {
    this.logger.warn(message);
  }

  info(message: any): void {
    this.logger.info(message);
  }

  private getFormats = (): winston.Logform.Format[] => {
    const formats = [winston.format.timestamp(), winston.format.json()];
    return isProduction
      ? [...formats, newrelicFormatter(winston)()]
      : [...formats, winston.format.prettyPrint()];
  };

  private getDefaultMeta = (): Record<string, any> => {
    const meta = { service: process.env.npm_package_name };
    return isProduction
      ? {
          ...meta,
          pod: process.env.POD_ID,
        }
      : meta;
  };
}
