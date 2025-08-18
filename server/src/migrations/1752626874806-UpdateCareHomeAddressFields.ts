import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCareHomeAddressFields1752626874806
  implements MigrationInterface
{
  name = "UpdateCareHomeAddressFields1752626874806";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new address fields
    await queryRunner.query(`
      ALTER TABLE "care_homes" 
      ADD COLUMN "addressLine1" character varying NOT NULL DEFAULT '',
      ADD COLUMN "addressLine2" character varying,
      ADD COLUMN "region" character varying,
      ADD COLUMN "area" character varying,
      ADD COLUMN "country" character varying DEFAULT 'United Kingdom'
    `);

    // Migrate existing data
    await queryRunner.query(`
      UPDATE "care_homes" 
      SET "addressLine1" = "address"
    `);

    // Drop old address and county columns
    await queryRunner.query(`
      ALTER TABLE "care_homes" 
      DROP COLUMN "address",
      DROP COLUMN "county"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate old columns
    await queryRunner.query(`
      ALTER TABLE "care_homes" 
      ADD COLUMN "address" character varying NOT NULL DEFAULT '',
      ADD COLUMN "county" character varying NOT NULL DEFAULT ''
    `);

    // Migrate data back
    await queryRunner.query(`
      UPDATE "care_homes" 
      SET "address" = "addressLine1",
          "county" = COALESCE("region", '')
    `);

    // Drop new columns
    await queryRunner.query(`
      ALTER TABLE "care_homes" 
      DROP COLUMN "addressLine1",
      DROP COLUMN "addressLine2",
      DROP COLUMN "region",
      DROP COLUMN "area",
      DROP COLUMN "country"
    `);
  }
}
