import { UnprocessableEntityException } from '@nestjs/common';

export enum BusinessError {
  DISABLED_FEATURE_TOGGLE = 'DISABLED_FEATURE_TOGGLE',
  INVALID_DISCOUNT = 'INVALID_DISCOUNT',
}

export default class BusinessException extends UnprocessableEntityException {
  constructor(message: string, code?: BusinessError | string) {
    super(message, code && code.toString());
  }
}
