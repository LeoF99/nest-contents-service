import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Boilerplate from '../domain/boilerplate';
import BoilerplateEntity from './boilerplate.entity';

@Injectable()
export default class BoilerplateRepository {
  constructor(
    @InjectRepository(BoilerplateEntity)
    private repository: Repository<BoilerplateEntity>,
  ) {}

  async upsert(boilerplate: Boilerplate): Promise<Boilerplate> {
    return (
      await this.repository.save(BoilerplateEntity.from(boilerplate))
    ).toBoilerplate();
  }
}
