import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWishlistFields1752623974904 implements MigrationInterface {
  name = "AddWishlistFields1752623974904";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing columns to wishlists table
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD "name" character varying NOT NULL DEFAULT 'My Wishlist'`,
    );
    await queryRunner.query(`ALTER TABLE "wishlists" ADD "description" text`);
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD "isPublic" boolean NOT NULL DEFAULT false`,
    );

    // Add missing columns to wishlist_items table
    await queryRunner.query(`ALTER TABLE "wishlist_items" ADD "notes" text`);
    await queryRunner.query(
      `ALTER TABLE "wishlist_items" ADD "quantity" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items" ADD "isPurchased" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove columns from wishlist_items table
    await queryRunner.query(
      `ALTER TABLE "wishlist_items" DROP COLUMN "isPurchased"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist_items" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(`ALTER TABLE "wishlist_items" DROP COLUMN "notes"`);

    // Remove columns from wishlists table
    await queryRunner.query(`ALTER TABLE "wishlists" DROP COLUMN "isPublic"`);
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "wishlists" DROP COLUMN "name"`);
  }
}
