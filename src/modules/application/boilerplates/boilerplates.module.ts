import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BoilerplateEntity from './adapters/boilerplate.entity';
import BoilerplateRepository from './adapters/boilerplates.repository';
import { BoilerplatesController } from './controllers/boilerplates.controller';
import BoilerplateService from './domain/boilerplates.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoilerplateEntity])],
  controllers: [BoilerplatesController],
  providers: [BoilerplateRepository, BoilerplateService],
  exports: [BoilerplateService],
})
export default class BoilerplateModule {}
