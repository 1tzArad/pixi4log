import { Request, Response, NextFunction } from "express";
import Logger from "../utils/Logger";

const logger = new Logger("Route-Logger");

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug(`➡️ ${req.method} ${req.originalUrl}`);

        if (req.params && Object.keys(req.params).length > 0) {
            logger.debug(`   Params: ${JSON.stringify(req.params)}`);
        }

        if (req.query && Object.keys(req.query).length > 0) {
            logger.debug(`   Query: ${JSON.stringify(req.query)}`);
        }

        if (req.body && Object.keys(req.body).length > 0) {
            logger.debug(`   Body: ${JSON.stringify(req.body)}`);
        }

    } catch (e) {
        logger.error((e as Error).message);
    }
    next();
};
