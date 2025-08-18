import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHealthcareHomes1752626874805 implements MigrationInterface {
  name = "CreateHealthcareHomes1752626874805";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create care_types table
    await queryRunner.query(`
            CREATE TABLE "care_types" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "icon" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "sortOrder" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_care_types_name" UNIQUE ("name"),
                CONSTRAINT "PK_care_types" PRIMARY KEY ("id")
            )
        `);

    // Create care_home_facilities table
    await queryRunner.query(`
            CREATE TABLE "care_home_facilities" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "icon" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "sortOrder" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_care_home_facilities_name" UNIQUE ("name"),
                CONSTRAINT "PK_care_home_facilities" PRIMARY KEY ("id")
            )
        `);

    // Create care_homes table
    await queryRunner.query(`
            CREATE TABLE "care_homes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "address" character varying NOT NULL,
                "city" character varying NOT NULL,
                "postcode" character varying NOT NULL,
                "county" character varying NOT NULL,
                "latitude" numeric(10,7),
                "longitude" numeric(10,7),
                "phone" character varying NOT NULL,
                "email" character varying,
                "website" character varying,
                "weeklyPrice" numeric(10,2),
                "monthlyPrice" numeric(10,2),
                "totalBeds" integer NOT NULL DEFAULT '0',
                "availableBeds" integer NOT NULL DEFAULT '0',
                "isActive" boolean NOT NULL DEFAULT true,
                "isVerified" boolean NOT NULL DEFAULT false,
                "isFeatured" boolean NOT NULL DEFAULT false,
                "specializations" text array DEFAULT '{}',
                "openingHours" jsonb,
                "contactInfo" jsonb,
                "rating" numeric(3,2),
                "reviewCount" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "careTypeId" uuid,
                "createdById" uuid,
                CONSTRAINT "PK_care_homes" PRIMARY KEY ("id")
            )
        `);

    // Create care_home_images table
    await queryRunner.query(`
            CREATE TABLE "care_home_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "alt" character varying,
                "isPrimary" boolean NOT NULL DEFAULT false,
                "sortOrder" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "careHomeId" uuid,
                CONSTRAINT "PK_care_home_images" PRIMARY KEY ("id")
            )
        `);

    // Create care_home_reviews table
    await queryRunner.query(`
            CREATE TABLE "care_home_reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "comment" text NOT NULL,
                "rating" integer NOT NULL DEFAULT '5',
                "isVerified" boolean NOT NULL DEFAULT true,
                "isAnonymous" boolean NOT NULL DEFAULT false,
                "reviewData" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "careHomeId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_care_home_reviews" PRIMARY KEY ("id")
            )
        `);

    // Create care_home_facilities_junction table
    await queryRunner.query(`
            CREATE TABLE "care_home_facilities_junction" (
                "care_home_id" uuid NOT NULL,
                "facility_id" uuid NOT NULL,
                CONSTRAINT "PK_care_home_facilities_junction" PRIMARY KEY ("care_home_id", "facility_id")
            )
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "care_homes" 
            ADD CONSTRAINT "FK_care_homes_care_type" 
            FOREIGN KEY ("careTypeId") REFERENCES "care_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    // Note: Users table foreign key will be added when users migration is created
    // For now, we'll skip this constraint to avoid dependency issues

    await queryRunner.query(`
            ALTER TABLE "care_home_images" 
            ADD CONSTRAINT "FK_care_home_images_care_home" 
            FOREIGN KEY ("careHomeId") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "care_home_reviews" 
            ADD CONSTRAINT "FK_care_home_reviews_care_home" 
            FOREIGN KEY ("careHomeId") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // Note: Users table foreign key will be added when users migration is created
    // For now, we'll skip this constraint to avoid dependency issues

    await queryRunner.query(`
            ALTER TABLE "care_home_facilities_junction" 
            ADD CONSTRAINT "FK_care_home_facilities_care_home" 
            FOREIGN KEY ("care_home_id") REFERENCES "care_homes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "care_home_facilities_junction" 
            ADD CONSTRAINT "FK_care_home_facilities_facility" 
            FOREIGN KEY ("facility_id") REFERENCES "care_home_facilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // Insert default care types
    await queryRunner.query(`
            INSERT INTO "care_types" ("name", "description", "icon", "sortOrder") VALUES
            ('Residential Care', '24-hour personal care and support for elderly residents', '🏠', 1),
            ('Nursing Care', 'Specialized nursing care for residents with medical needs', '🏥', 2),
            ('Dementia Care', 'Specialized care for residents with dementia and memory loss', '🧠', 3),
            ('Respite Care', 'Short-term care to give family caregivers a break', '⏰', 4),
            ('Palliative Care', 'End-of-life care focusing on comfort and quality of life', '🕊️', 5),
            ('Learning Disability Care', 'Specialized care for adults with learning disabilities', '🎓', 6)
        `);

    // Insert default facilities
    await queryRunner.query(`
            INSERT INTO "care_home_facilities" ("name", "description", "icon", "sortOrder") VALUES
            ('Garden', 'Beautiful outdoor garden space for residents', '🌺', 1),
            ('Lounge', 'Comfortable communal lounge areas', '🛋️', 2),
            ('Dining Room', 'Elegant dining room with restaurant-style service', '🍽️', 3),
            ('En-suite Rooms', 'Private rooms with en-suite bathrooms', '🚿', 4),
            ('Lift Access', 'Full lift access throughout the building', '🛗', 5),
            ('WiFi', 'Free WiFi available for residents and visitors', '📶', 6),
            ('Activities Room', 'Dedicated space for activities and entertainment', '🎨', 7),
            ('Hair Salon', 'On-site hair salon for residents', '💇‍♀️', 8),
            ('Library', 'Quiet library space for reading and relaxation', '📚', 9),
            ('Chapel', 'Multi-faith chapel for spiritual needs', '⛪', 10),
            ('Physiotherapy', 'On-site physiotherapy services', '💪', 11),
            ('GP Visits', 'Regular GP visits to the care home', '👨‍⚕️', 12),
            ('Specialist Nurses', 'Specialist nursing staff available', '👩‍⚕️', 13),
            ('Secure Environment', 'Secure environment for residents with dementia', '🔒', 14),
            ('Pet Friendly', 'Pet-friendly environment', '🐕', 15),
            ('Family Rooms', 'Private family rooms for visits', '👨‍👩‍👧‍👦', 16)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "care_home_facilities_junction" DROP CONSTRAINT "FK_care_home_facilities_facility"`
    );
    await queryRunner.query(
      `ALTER TABLE "care_home_facilities_junction" DROP CONSTRAINT "FK_care_home_facilities_care_home"`
    );
    await queryRunner.query(
      `ALTER TABLE "care_home_reviews" DROP CONSTRAINT "FK_care_home_reviews_care_home"`
    );
    await queryRunner.query(
      `ALTER TABLE "care_home_images" DROP CONSTRAINT "FK_care_home_images_care_home"`
    );
    await queryRunner.query(
      `ALTER TABLE "care_homes" DROP CONSTRAINT "FK_care_homes_care_type"`
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "care_home_facilities_junction"`);
    await queryRunner.query(`DROP TABLE "care_home_reviews"`);
    await queryRunner.query(`DROP TABLE "care_home_images"`);
    await queryRunner.query(`DROP TABLE "care_homes"`);
    await queryRunner.query(`DROP TABLE "care_home_facilities"`);
    await queryRunner.query(`DROP TABLE "care_types"`);
  }
}
