import { when } from 'jest-when';
import { Unleash } from 'unleash-client';

import Feature from '../feature';
import FeaturesService from '../features.service';

jest.mock('unleash-client');
const UnleashMock = Unleash as jest.MockedClass<typeof Unleash>;

describe('FeaturesService', () => {
  const unleash = new UnleashMock({
    appName: 'boilerplate-service',
    url: 'http://unleash-url',
  });
  let featuresService: FeaturesService;

  beforeEach(() => {
    unleash.isEnabled = jest.fn();
    featuresService = new FeaturesService(unleash);
  });

  describe('isEnabled', () => {
    it('calls unleash client isEnabled method and returns the result when true', () => {
      when(unleash.isEnabled)
        .calledWith('feature' as Feature)
        .mockReturnValue(true);
      const result = featuresService.isEnabled('feature' as Feature);

      expect(result).toBeTruthy();
      expect(unleash.isEnabled).toBeCalledTimes(1);
    });

    it('calls unleash client isEnabled method and returns the result when false', () => {
      when(unleash.isEnabled)
        .calledWith('feature' as Feature)
        .mockReturnValue(false);
      const result = featuresService.isEnabled('feature' as Feature);

      expect(result).toBeFalsy();
      expect(unleash.isEnabled).toBeCalledTimes(1);
    });
  });
});
