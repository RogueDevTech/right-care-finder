import { DataSource } from "typeorm";
import { config } from "dotenv";

// Load environment variables
config();

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "rightcarefinder",
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
});

async function updateCareHomesCreatedBy() {
  try {
    await dataSource.initialize();
    console.log("Database connection established");

    // Update all care homes to have null createdBy if they don't have it set
    const result = await dataSource.query(`
      UPDATE care_homes 
      SET "createdByUserId" = NULL 
      WHERE "createdByUserId" IS NULL OR "createdByUserId" = ''
    `);

    console.log(`Updated ${result[1]} care homes to have null createdBy`);

    // Verify the update
    const careHomes = await dataSource.query(`
      SELECT id, name, "createdByUserId" 
      FROM care_homes 
      WHERE "isActive" = true
    `);

    console.log("Current care homes:");
    careHomes.forEach((ch: any) => {
      console.log(
        `- ${ch.name} (ID: ${ch.id}, createdBy: ${ch.createdByUserId})`
      );
    });

    await dataSource.destroy();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error updating care homes:", error);
    await dataSource.destroy();
  }
}

updateCareHomesCreatedBy();
