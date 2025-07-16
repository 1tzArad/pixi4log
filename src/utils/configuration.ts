import dotenv from 'dotenv';
import path from 'path';
import Logger from './Logger';

const logger = new Logger("Configuration");

const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';

logger.debug(`Loading environment file: ${envFile}`);

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

logger.debug("Environment variables loaded");

const config = {
    port: Number(process.env.PORT) || 3000,
    database: {
        host: process.env.DB_HOST || '',
        name: process.env.DB_NAME || '',
        username: process.env.DB_USER || '',
        password: process.env.DB_PASS || ''
    }
};

logger.debug(`Configuration object created: port=${config.port}, db host=${config.database.host}`);

export default config;
