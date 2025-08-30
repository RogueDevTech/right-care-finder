import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvitationsTable1756559010529 implements MigrationInterface {
    name = 'CreateInvitationsTable1756559010529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "care_types" DROP COLUMN "sortOrder"`);
        await queryRunner.query(`ALTER TABLE "specializations" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "specializations" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "specializations" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "specializations" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "care_types" ADD "sortOrder" integer NOT NULL DEFAULT '0'`);
    }

}
