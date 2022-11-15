import BoilerplateRepository from '../../adapters/boilerplates.repository';
import Boilerplate from '../boilerplate';
import BoilerplateService from '../boilerplates.service';

jest.mock('../../adapters/boilerplates.repository');

describe('BoilerplateService', () => {
  let service: BoilerplateService;
  const boilerplateRepository = new BoilerplateRepository(null);

  beforeEach(() => {
    service = new BoilerplateService(boilerplateRepository);
  });
  describe('create', () => {
    it('calls repository to upsert', async () => {
      const boilerplate = new Boilerplate({ name: 'test' });
      const boilerplateWithId = new Boilerplate({ name: 'test', id: 'uuid' });
      boilerplateRepository.upsert = jest
        .fn()
        .mockResolvedValue(boilerplateWithId);

      const createdBoileplate = await service.create(boilerplate);

      expect(boilerplateRepository.upsert).toBeCalledWith(boilerplate);
      expect(createdBoileplate).toEqual(boilerplateWithId);
    });
  });
});
