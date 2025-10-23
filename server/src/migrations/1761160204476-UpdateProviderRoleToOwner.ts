import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProviderRoleToOwner1761160204476
  implements MigrationInterface
{
  name = "UpdateProviderRoleToOwner1761160204476";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_34514f0bb860035ef4c7e183341"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_BLOG_POST_SLUG"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_BLOG_POST_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_BLOG_POST_CATEGORY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_BLOG_POST_CREATED_BY"`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user', 'owner')`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING CASE WHEN "role"::text = 'provider' THEN 'owner'::text ELSE "role"::text END::"public"."users_role_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`
    );
    await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "blog_posts" ALTER COLUMN "createdAt" SET DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "blog_posts" ALTER COLUMN "updatedAt" SET DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_34514f0bb860035ef4c7e183341" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_34514f0bb860035ef4c7e183341"`
    );
    await queryRunner.query(
      `ALTER TABLE "blog_posts" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`
    );
    await queryRunner.query(
      `ALTER TABLE "blog_posts" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum_old" AS ENUM('admin', 'user', 'provider')`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING CASE WHEN "role"::text = 'owner' THEN 'provider'::text ELSE "role"::text END::"public"."users_role_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`
    );
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BLOG_POST_CREATED_BY" ON "blog_posts" ("createdBy") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BLOG_POST_CATEGORY" ON "blog_posts" ("category") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BLOG_POST_STATUS" ON "blog_posts" ("status") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BLOG_POST_SLUG" ON "blog_posts" ("slug") `
    );
    await queryRunner.query(
      `ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_34514f0bb860035ef4c7e183341" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
