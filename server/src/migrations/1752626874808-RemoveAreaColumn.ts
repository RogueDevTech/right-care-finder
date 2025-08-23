import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAreaColumn1752626874808 implements MigrationInterface {
  name = "RemoveAreaColumn1752626874808";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove the area column from care_homes table
    await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "area"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the area column in case of rollback
    await queryRunner.query(
      `ALTER TABLE "care_homes" ADD "area" character varying`
    );
  }
}
