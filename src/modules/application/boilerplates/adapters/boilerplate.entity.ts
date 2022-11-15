import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import Boilerplate from '../domain/boilerplate';

@Entity('boilerplates')
export default class BoilerplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ length: 255 })
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  toBoilerplate(): Boilerplate {
    return new Boilerplate({
      id: this.id,
      name: this.name,
    });
  }

  static from(boilerplate: Boilerplate): BoilerplateEntity {
    return new BoilerplateEntity(boilerplate.id, boilerplate.name);
  }
}
