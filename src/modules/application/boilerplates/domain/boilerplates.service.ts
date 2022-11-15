import { Injectable } from '@nestjs/common';
import BoilerplateRepository from '../adapters/boilerplates.repository';
import Boilerplate from './boilerplate';

@Injectable()
export default class BoilerplateService {
  constructor(private repository: BoilerplateRepository) {}

  async create(boilerplate: Boilerplate): Promise<Boilerplate> {
    return this.repository.upsert(boilerplate);
  }
}
