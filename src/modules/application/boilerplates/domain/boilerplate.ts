export default class Boilerplate {
  readonly id: string;

  readonly name: string;

  constructor(args: { id?: string; name: string }) {
    this.id = args.id;
    this.name = args.name;
  }
}
