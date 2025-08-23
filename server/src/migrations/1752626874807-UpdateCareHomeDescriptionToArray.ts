import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCareHomeDescriptionToArray1752626874807
  implements MigrationInterface
{
  name = "UpdateCareHomeDescriptionToArray1752626874807";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, create a temporary column with the new array type
    await queryRunner.query(
      `ALTER TABLE "care_homes" ADD "description_new" text array DEFAULT '{}'`
    );

    // Copy existing description data to the new array column
    // Convert single text to array with one element
    await queryRunner.query(
      `UPDATE "care_homes" SET "description_new" = ARRAY[description] WHERE description IS NOT NULL AND description != ''`
    );

    // Drop the old description column
    await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "description"`);

    // Rename the new column to description
    await queryRunner.query(
      `ALTER TABLE "care_homes" RENAME COLUMN "description_new" TO "description"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Create a temporary text column
    await queryRunner.query(
      `ALTER TABLE "care_homes" ADD "description_old" text`
    );

    // Convert array back to single text (take first element or empty string)
    await queryRunner.query(
      `UPDATE "care_homes" SET "description_old" = COALESCE(description[1], '')`
    );

    // Drop the array column
    await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "description"`);

    // Rename the old column back to description
    await queryRunner.query(
      `ALTER TABLE "care_homes" RENAME COLUMN "description_old" TO "description"`
    );
  }
}
