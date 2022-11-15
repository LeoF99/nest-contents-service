import { Global, Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import * as http from 'http';
import * as https from 'https';
import AppLogger from '../logging/app.logger';
import context from '@sanardigital/traceability-core';

@Global()
@Module({
  imports: [
    HttpModule.register({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
    }),
  ],
  providers: [AppLogger],
  exports: [HttpModule],
})
export default class AppHttpModule implements OnModuleInit {
  constructor(private httpService: HttpService, private logger: AppLogger) {}

  public onModuleInit(): void {
    let requestStart;
    this.httpService.axiosRef.interceptors.request.use((config) => {
      const configToBeUsed = config;
      const trackId = context.getTrackId();
      if (trackId) {
        configToBeUsed.headers.trackId = trackId;
      }
      requestStart = Date.now();
      this.logger.info(
        `Started Outbound HTTP Request ${config.method.toUpperCase()} ${
          config.url
        }`,
      );

      return configToBeUsed;
    });

    this.httpService.axiosRef.interceptors.response.use(
      (response) => {
        const elapsedTime = Date.now() - requestStart;
        this.logger.info(
          `Finished Outbound HTTP Request ${response.config.method.toUpperCase()} ${
            response.config.url
          } in ${elapsedTime}ms with status ${response.status}`,
        );
        return response;
      },
      (error) => {
        const elapsedTime = Date.now() - requestStart;
        this.logger.error(
          `Finished Outbound HTTP Request ${error.config.method.toUpperCase()} ${
            error.config.url
          } in ${elapsedTime}ms with status ${error?.response?.status}`,
          error.config?.errorContext?.stack,
        );

        return Promise.reject(error);
      },
    );
  }
}
