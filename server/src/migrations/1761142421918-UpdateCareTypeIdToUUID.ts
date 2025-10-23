import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCareTypeIdToUUID1761142421918 implements MigrationInterface {
  name = "UpdateCareTypeIdToUUID1761142421918";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, add new UUID columns
    await queryRunner.query(
      `ALTER TABLE "care_types" ADD "new_id" uuid NOT NULL DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "care_homes" ADD "new_careTypeId" uuid`
    );

    // Update the new UUID columns with existing data
    // For care_types, we'll generate new UUIDs
    await queryRunner.query(
      `UPDATE "care_types" SET "new_id" = uuid_generate_v4()`
    );

    // For care_homes, we'll map the old integer IDs to the new UUID IDs
    await queryRunner.query(`
            UPDATE "care_homes" 
            SET "new_careTypeId" = ct.new_id 
            FROM "care_types" ct 
            WHERE "care_homes"."careTypeId" = ct.id
        `);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "care_homes" DROP CONSTRAINT "FK_e3a5f7456ed0d414925abbf06c7"`
    );

    // Drop old columns and rename new ones
    await queryRunner.query(
      `ALTER TABLE "care_homes" DROP COLUMN "careTypeId"`
    );
    await queryRunner.query(
      `ALTER TABLE "care_homes" RENAME COLUMN "new_careTypeId" TO "careTypeId"`
    );

    await queryRunner.query(
      `ALTER TABLE "care_types" DROP CONSTRAINT "PK_75c57dc7606def957d01b77bce5"`
    );
    await queryRunner.query(`ALTER TABLE "care_types" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "care_types" RENAME COLUMN "new_id" TO "id"`
    );
    await queryRunner.query(
      `ALTER TABLE "care_types" ADD CONSTRAINT "PK_75c57dc7606def957d01b77bce5" PRIMARY KEY ("id")`
    );

    // Recreate foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "care_homes" ADD CONSTRAINT "FK_e3a5f7456ed0d414925abbf06c7" FOREIGN KEY ("careTypeId") REFERENCES "care_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "care_homes" DROP CONSTRAINT "FK_e3a5f7456ed0d414925abbf06c7"`
    );

    // Add new integer columns
    await queryRunner.query(
      `ALTER TABLE "care_types" ADD "old_id" SERIAL NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "care_homes" ADD "old_careTypeId" integer`
    );

    // Update the integer columns with sequential IDs
    await queryRunner.query(
      `UPDATE "care_types" SET "old_id" = nextval('care_types_old_id_seq')`
    );

    // Map UUIDs back to integers (this is complex and may not be perfect)
    await queryRunner.query(`
            UPDATE "care_homes" 
            SET "old_careTypeId" = ct.old_id 
            FROM "care_types" ct 
            WHERE "care_homes"."careTypeId" = ct.id
        `);

    // Drop UUID columns and rename integer ones
    await queryRunner.query(
      `ALTER TABLE "care_homes" DROP COLUMN "careTypeId"`
    );
    await queryRunner.query(
      `ALTER TABLE "care_homes" RENAME COLUMN "old_careTypeId" TO "careTypeId"`
    );

    await queryRunner.query(
      `ALTER TABLE "care_types" DROP CONSTRAINT "PK_75c57dc7606def957d01b77bce5"`
    );
    await queryRunner.query(`ALTER TABLE "care_types" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "care_types" RENAME COLUMN "old_id" TO "id"`
    );
    await queryRunner.query(
      `ALTER TABLE "care_types" ADD CONSTRAINT "PK_75c57dc7606def957d01b77bce5" PRIMARY KEY ("id")`
    );

    // Recreate foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "care_homes" ADD CONSTRAINT "FK_e3a5f7456ed0d414925abbf06c7" FOREIGN KEY ("careTypeId") REFERENCES "care_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
