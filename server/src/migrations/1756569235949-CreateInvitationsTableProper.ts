import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvitationsTableProper1756569235949 implements MigrationInterface {
    name = 'CreateInvitationsTableProper1756569235949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invitations_status_enum" AS ENUM('pending', 'accepted', 'expired')`);
        await queryRunner.query(`CREATE TABLE "invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneNumber" character varying, "careHomeId" uuid, "message" text, "status" "public"."invitations_status_enum" NOT NULL DEFAULT 'pending', "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "acceptedAt" TIMESTAMP, "acceptedByUserId" uuid, "invitedByUserId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_5beb2ae50299811ce16a10fae2d" FOREIGN KEY ("careHomeId") REFERENCES "care_homes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_3722ea7511a7ce9235525c1daa3" FOREIGN KEY ("acceptedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_b7423cfb362a842b7ea0a3763b9" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_b7423cfb362a842b7ea0a3763b9"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_3722ea7511a7ce9235525c1daa3"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_5beb2ae50299811ce16a10fae2d"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
        await queryRunner.query(`DROP TYPE "public"."invitations_status_enum"`);
    }

}
