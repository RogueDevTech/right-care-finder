import * as dotenv from "dotenv";
import * as path from "path";
import { DataSource, DataSourceOptions, LoggerOptions } from "typeorm";
import { entities } from "./entities";
const dotenv_path = path.resolve(process.cwd(), ".env");
dotenv.config({ path: dotenv_path });

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: Object.values(entities),
  ssl: {
    rejectUnauthorized: false, // or provide CA cert if needed
  },
  synchronize: false, // Disable auto-synchronization
  migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
  migrationsTableName: "migrations",
  migrationsRun: false, // Don't run migrations automatically
  logging: process.env.TYPEORM_LOGGING as LoggerOptions,
  // namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
