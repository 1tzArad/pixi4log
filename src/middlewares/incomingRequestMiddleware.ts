import {NextFunction, Response} from "express";
import Logger from "../utils/Logger";
const logger = new Logger("Incoming-Request")
export default (req:Request, res: Response, next: NextFunction) => {
    try{
        logger.debug(`Incoming request: ${req.method} ${req.url}`);
        next();
    }catch (e) {
        logger.error((e as Error).message)
    }
}