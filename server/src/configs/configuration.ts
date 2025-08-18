import * as dotenv from "dotenv";
import * as path from "path";

const dotenv_path = path.resolve(process.cwd(), `.env`);
dotenv.config({ path: dotenv_path });

export const configuration = () => {
  return {
    core: {
      environment: process.env.NODE_ENV,
      port: process.env.PORT,
      database_url: process.env.DATABASE_URL,
    },
    database: {
      type: "postgres",
      dbUrl: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
};
