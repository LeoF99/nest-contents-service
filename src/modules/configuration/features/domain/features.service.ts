import { Inject, Injectable } from '@nestjs/common';
import { Unleash } from 'unleash-client';
import Feature from './feature';

@Injectable()
export default class FeaturesService {
  constructor(@Inject('unleash') private unleash: Unleash) {}

  isEnabled = (feature: Feature): boolean => {
    return this.unleash.isEnabled(feature);
  };
}
