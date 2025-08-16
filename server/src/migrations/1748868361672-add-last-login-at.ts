import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastLoginAt1748868361672 implements MigrationInterface {
  name = "AddLastLoginAt1748868361672";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "lastLoginAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLoginAt"`);
  }
}
