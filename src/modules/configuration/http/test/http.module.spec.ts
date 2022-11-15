import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import nock from 'nock';

import AppHttpModule from '../http.module';
import AppLogger from '../../logging/app.logger';
import { lastValueFrom } from 'rxjs';

jest.mock('../../logging/app.logger');

describe('AppHttpModule', () => {
  let httpService: HttpService;
  let mockedAppLogger: AppLogger;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppHttpModule],
      providers: [AppLogger],
    }).compile();
    await module.init();

    httpService = module.get(HttpService);

    mockedAppLogger = module.get(AppLogger);
    mockedAppLogger.info = jest.fn();
    mockedAppLogger.error = jest.fn();
  });

  beforeEach(() => {
    nock('https://url').get('/v1').reply(200).get('/v2').reply(200);
  });

  describe('httpService', () => {
    it('sets keepAlive to true for http and https agents', async () => {
      const firstRequest = await lastValueFrom(
        httpService.get('https://url/v1'),
      );

      expect(firstRequest.config.httpAgent?.keepAlive).toEqual(true);
      expect(firstRequest.config.httpsAgent?.keepAlive).toEqual(true);
    });

    describe('logging axios requests', () => {
      beforeEach(() => {
        const requestStartTime = Date.now();
        const requestEndTime = requestStartTime + 15;
        Date.now = jest
          .fn()
          .mockReturnValueOnce(requestStartTime)
          .mockReturnValue(requestEndTime);

        nock('https://url').post('/v1').reply(201).post('/v3').reply(422);
      });

      afterEach(() => {
        (Date.now as jest.Mock).mockClear();
        (mockedAppLogger.info as jest.Mock).mockClear();
        (mockedAppLogger.error as jest.Mock).mockClear();
      });

      it('logs request start message', async () => {
        await lastValueFrom(httpService.post('https://url/v1'));

        expect(mockedAppLogger.info).toHaveBeenCalledWith(
          'Started Outbound HTTP Request POST https://url/v1',
        );
      });

      it('logs request end with succesfully message', async () => {
        await lastValueFrom(httpService.post('https://url/v1'));

        expect(mockedAppLogger.info).toHaveBeenCalledWith(
          'Finished Outbound HTTP Request POST https://url/v1 in 15ms with status 201',
        );
      });

      it('logs request end with error message', async () => {
        try {
          await lastValueFrom(httpService.post('https://url/v3'));
        } catch {
          expect(mockedAppLogger.error).toHaveBeenCalledWith(
            'Finished Outbound HTTP Request POST https://url/v3 in 15ms with status 422',
            undefined,
          );
        }
      });
    });
  });
});
