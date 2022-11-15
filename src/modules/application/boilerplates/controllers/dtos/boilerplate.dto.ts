import Boilerplate from '../../domain/boilerplate';

export class CreateBoilerplateDTO {
  readonly name: string;

  toBoilerplate(): Boilerplate {
    return new Boilerplate({ name: this.name });
  }
}
