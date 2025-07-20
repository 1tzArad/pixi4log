import { DataSource } from "typeorm";
import configuration from "../utils/configuration";

export const dataSource = new DataSource({
  type: "postgres",
  host: configuration.database.host,
  database: configuration.database.name,
  username: configuration.database.username,
  password: configuration.database.password,
  entities: [
    process.env.NODE_ENV === "development"
      ? __dirname + "/entity/*.ts"
      : __dirname + "/entity/*.js",
  ],
  synchronize: true,
  logging: false,
});
