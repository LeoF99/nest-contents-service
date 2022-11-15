import { Body, Controller, Post } from '@nestjs/common';
import Boilerplate from '../domain/boilerplate';
import BoilerplateService from '../domain/boilerplates.service';
import { CreateBoilerplateDTO } from './dtos/boilerplate.dto';

@Controller('boilerplates')
export class BoilerplatesController {
  constructor(private service: BoilerplateService) {}

  @Post()
  create(@Body() dto: CreateBoilerplateDTO): Promise<Boilerplate> {
    return this.service.create(dto.toBoilerplate());
  }
}
