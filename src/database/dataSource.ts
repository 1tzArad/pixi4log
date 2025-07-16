import { DataSource } from 'typeorm'
import configuration from "../utils/configuration";

export const dataSource = new DataSource({
    type: 'postgres',
    host: configuration.database.host,
    database: configuration.database.name,
    username: configuration.database.username,
    password: configuration.database.password,
    entities: [__dirname + "/entity/*.ts"],
    synchronize: true,
    logging: false
});