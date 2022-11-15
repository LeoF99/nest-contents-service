import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import DatabaseModule from '../../../configuration/database/database.module';

interface Helper {
  readonly module: TestingModule;
  readonly entityManager: EntityManager;
  readonly repository: any;
}

const databaseIntegrationTestModule = async (
  repository,
  entity,
): Promise<Helper> => {
  const module = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ envFilePath: globalThis.ENV_FILE }),
      DatabaseModule,
      TypeOrmModule.forFeature([entity]),
    ],
    providers: [repository],
  }).compile();

  return {
    module,
    repository: module.get(repository),
    entityManager: module.get(EntityManager),
  };
};

export default databaseIntegrationTestModule;
