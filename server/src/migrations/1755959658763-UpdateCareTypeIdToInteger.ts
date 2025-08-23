import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCareTypeIdToInteger1755959658763 implements MigrationInterface {
    name = 'UpdateCareTypeIdToInteger1755959658763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "care_home_images" DROP CONSTRAINT "FK_care_home_images_care_home"`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP CONSTRAINT "FK_care_homes_care_type"`);
        await queryRunner.query(`ALTER TABLE "care_home_reviews" DROP CONSTRAINT "FK_care_home_reviews_care_home"`);
        await queryRunner.query(`ALTER TABLE "care_home_facilities_junction" DROP CONSTRAINT "FK_care_home_facilities_care_home"`);
        await queryRunner.query(`ALTER TABLE "care_home_facilities_junction" DROP CONSTRAINT "FK_care_home_facilities_facility"`);
        await queryRunner.query(`CREATE TYPE "public"."user_addresses_type_enum" AS ENUM('home', 'work', 'other')`);
        await queryRunner.query(`CREATE TABLE "user_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying NOT NULL, "type" "public"."user_addresses_type_enum" NOT NULL DEFAULT 'home', "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "zipCode" character varying NOT NULL, "apartment" character varying, "phoneNumber" character varying, "isDefault" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8abbeb5e3239ff7877088ffc25b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD "cqcRating" character varying`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD "lastInspectionDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD "ageRestriction" character varying`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD "acceptingNewResidents" boolean`);
        await queryRunner.query(`ALTER TABLE "care_types" DROP CONSTRAINT "PK_care_types"`);
        await queryRunner.query(`ALTER TABLE "care_types" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "care_types" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "care_types" ADD CONSTRAINT "PK_75c57dc7606def957d01b77bce5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "care_homes" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "care_homes" ALTER COLUMN "addressLine1" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "care_homes" ALTER COLUMN "country" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "careTypeId"`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD "careTypeId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_e2612f96935de3cf74dd63cb31" ON "care_home_facilities_junction" ("care_home_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d875d2c670801feb1d0723a14" ON "care_home_facilities_junction" ("facility_id") `);
        await queryRunner.query(`ALTER TABLE "user_addresses" ADD CONSTRAINT "FK_781afdedafe920f331f6229cb62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_home_images" ADD CONSTRAINT "FK_cbca4c5b5d364badbfc89511b47" FOREIGN KEY ("careHomeId") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD CONSTRAINT "FK_e3a5f7456ed0d414925abbf06c7" FOREIGN KEY ("careTypeId") REFERENCES "care_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD CONSTRAINT "FK_a708ff48740f4f477dd14ae7282" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_home_reviews" ADD CONSTRAINT "FK_7d3d827f26c54086261911cccf1" FOREIGN KEY ("careHomeId") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_home_reviews" ADD CONSTRAINT "FK_e28b36c051f01e8ace75af19614" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_home_facilities_junction" ADD CONSTRAINT "FK_e2612f96935de3cf74dd63cb31a" FOREIGN KEY ("care_home_id") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "care_home_facilities_junction" ADD CONSTRAINT "FK_8d875d2c670801feb1d0723a145" FOREIGN KEY ("facility_id") REFERENCES "care_home_facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "care_home_facilities_junction" DROP CONSTRAINT "FK_8d875d2c670801feb1d0723a145"`);
        await queryRunner.query(`ALTER TABLE "care_home_facilities_junction" DROP CONSTRAINT "FK_e2612f96935de3cf74dd63cb31a"`);
        await queryRunner.query(`ALTER TABLE "care_home_reviews" DROP CONSTRAINT "FK_e28b36c051f01e8ace75af19614"`);
        await queryRunner.query(`ALTER TABLE "care_home_reviews" DROP CONSTRAINT "FK_7d3d827f26c54086261911cccf1"`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP CONSTRAINT "FK_a708ff48740f4f477dd14ae7282"`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP CONSTRAINT "FK_e3a5f7456ed0d414925abbf06c7"`);
        await queryRunner.query(`ALTER TABLE "care_home_images" DROP CONSTRAINT "FK_cbca4c5b5d364badbfc89511b47"`);
        await queryRunner.query(`ALTER TABLE "user_addresses" DROP CONSTRAINT "FK_781afdedafe920f331f6229cb62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d875d2c670801feb1d0723a14"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2612f96935de3cf74dd63cb31"`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "careTypeId"`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD "careTypeId" uuid`);
        await queryRunner.query(`ALTER TABLE "care_homes" ALTER COLUMN "country" SET DEFAULT 'United Kingdom'`);
        await queryRunner.query(`ALTER TABLE "care_homes" ALTER COLUMN "addressLine1" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "care_homes" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "care_types" DROP CONSTRAINT "PK_75c57dc7606def957d01b77bce5"`);
        await queryRunner.query(`ALTER TABLE "care_types" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "care_types" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "care_types" ADD CONSTRAINT "PK_care_types" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "acceptingNewResidents"`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "ageRestriction"`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "lastInspectionDate"`);
        await queryRunner.query(`ALTER TABLE "care_homes" DROP COLUMN "cqcRating"`);
        await queryRunner.query(`DROP TABLE "user_addresses"`);
        await queryRunner.query(`DROP TYPE "public"."user_addresses_type_enum"`);
        await queryRunner.query(`ALTER TABLE "care_home_facilities_junction" ADD CONSTRAINT "FK_care_home_facilities_facility" FOREIGN KEY ("facility_id") REFERENCES "care_home_facilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_home_facilities_junction" ADD CONSTRAINT "FK_care_home_facilities_care_home" FOREIGN KEY ("care_home_id") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_home_reviews" ADD CONSTRAINT "FK_care_home_reviews_care_home" FOREIGN KEY ("careHomeId") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_homes" ADD CONSTRAINT "FK_care_homes_care_type" FOREIGN KEY ("careTypeId") REFERENCES "care_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "care_home_images" ADD CONSTRAINT "FK_care_home_images_care_home" FOREIGN KEY ("careHomeId") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
