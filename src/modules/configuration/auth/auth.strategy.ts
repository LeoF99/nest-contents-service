import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';

export const API_KEY_AUTH_HEADER = 'X-API-KEY';

@Injectable()
export default class AuthStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  constructor(private readonly configService: ConfigService) {
    super(
      { header: API_KEY_AUTH_HEADER },
      true,
      async (apiKey: string, done) => {
        return this.validate(apiKey, done);
      },
    );
  }

  public validate = async (
    apiKey: string,
    done: (error: Error, data) => void,
  ): Promise<void> => {
    if (this.validateApiKey(apiKey)) {
      done(null, 'client allowed');
    }

    done(new UnauthorizedException(), null);
  };

  private validateApiKey(apiKey: string): string {
    const validApiKeys = this.configService.get<string>('API_KEY').split(',');
    return validApiKeys.find((validKey) => apiKey === validKey);
  }
}
