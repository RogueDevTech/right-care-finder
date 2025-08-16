import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1748043394139 implements MigrationInterface {
  name = "InitialMigration1748043394139";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'customer', 'staff')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled')`,
    );

    // Create users table
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'customer',
                "phoneNumber" character varying,
                "address" character varying,
                "dateOfBirth" TIMESTAMP,
                "isEmailVerified" boolean NOT NULL DEFAULT false,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

    // Create categories table
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "image" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_categories" PRIMARY KEY ("id")
            )
        `);

    // Create brands table
    await queryRunner.query(`
            CREATE TABLE "brands" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "logo" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_brands" PRIMARY KEY ("id")
            )
        `);

    // Create products table
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "price" decimal(10,2) NOT NULL,
                "salePrice" decimal(10,2),
                "sku" character varying NOT NULL,
                "stock" integer NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "images" text[],
                "specifications" jsonb,
                "categoryId" uuid,
                "brandId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_products" PRIMARY KEY ("id"),
                CONSTRAINT "FK_products_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id"),
                CONSTRAINT "FK_products_brand" FOREIGN KEY ("brandId") REFERENCES "brands"("id")
            )
        `);

    // Create orders table
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "totalAmount" decimal(10,2) NOT NULL,
                "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending',
                "shippingAddress" jsonb NOT NULL,
                "billingAddress" jsonb,
                "trackingNumber" character varying,
                "notes" text,
                "userId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
                CONSTRAINT "FK_orders_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
            )
        `);

    // Create order_items table
    await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "quantity" integer NOT NULL,
                "unitPrice" decimal(10,2) NOT NULL,
                "totalPrice" decimal(10,2) NOT NULL,
                "orderId" uuid,
                "productId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_order_items_order" FOREIGN KEY ("orderId") REFERENCES "orders"("id"),
                CONSTRAINT "FK_order_items_product" FOREIGN KEY ("productId") REFERENCES "products"("id")
            )
        `);

    // Create payments table
    await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "amount" decimal(10,2) NOT NULL,
                "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending',
                "paymentMethod" character varying NOT NULL,
                "transactionId" character varying,
                "userId" uuid,
                "orderId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
                CONSTRAINT "FK_payments_user" FOREIGN KEY ("userId") REFERENCES "users"("id"),
                CONSTRAINT "FK_payments_order" FOREIGN KEY ("orderId") REFERENCES "orders"("id")
            )
        `);

    // Create wishlists table
    await queryRunner.query(`
            CREATE TABLE "wishlists" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_wishlists" PRIMARY KEY ("id"),
                CONSTRAINT "FK_wishlists_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
            )
        `);

    // Create wishlist_items table
    await queryRunner.query(`
            CREATE TABLE "wishlist_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "wishlistId" uuid,
                "productId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_wishlist_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_wishlist_items_wishlist" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id"),
                CONSTRAINT "FK_wishlist_items_product" FOREIGN KEY ("productId") REFERENCES "products"("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "wishlist_items"`);
    await queryRunner.query(`DROP TABLE "wishlists"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "brands"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
