import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1660072699389 implements MigrationInterface {
  name = 'Initial1660072699389';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`boilerplates\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`boilerplates\``);
  }
}
