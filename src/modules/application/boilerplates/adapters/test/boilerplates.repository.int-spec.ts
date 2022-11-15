import { TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import databaseIntegrationTestModule from '../../../test/helpers/databaseIntTest.module';
import Boilerplate from '../../domain/boilerplate';
import BoilerplateEntity from '../boilerplate.entity';
import BoilerplateRepository from '../boilerplates.repository';

describe('PlansRepository', () => {
  let repository: BoilerplateRepository;
  let entityManager: EntityManager;
  let module: TestingModule;

  beforeAll(async () => {
    ({ repository, entityManager, module } =
      await databaseIntegrationTestModule(
        BoilerplateRepository,
        BoilerplateEntity,
      ));
  }, 20000);

  afterAll(async () => {
    await module.close();
  });

  describe('upsert', () => {
    beforeEach(async () => {
      await entityManager.clear(BoilerplateEntity);
    });

    it('persists boilerplate entity', async () => {
      const boilerplate = await repository.upsert(
        new Boilerplate({ name: 'test' }),
      );

      const persistedBoilerplate = await entityManager.find(BoilerplateEntity);

      expect(persistedBoilerplate).toHaveLength(1);
      expect(boilerplate.id).toEqual(persistedBoilerplate[0].id);
      expect(boilerplate.name).toEqual(persistedBoilerplate[0].name);
    });
  });
});
