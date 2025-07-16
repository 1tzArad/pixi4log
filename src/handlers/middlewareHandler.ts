import path from "path";
import fs from "fs";
import Logger from "../utils/Logger";
import { Application, RequestHandler } from "express";

const logger = new Logger("Middlewares-Handler");

export default (app: Application) => {
    const middlewaresDirectoryPath = path.join(__dirname, "..", "middlewares");
    if (!fs.existsSync(middlewaresDirectoryPath)) {
        logger.warn("Middlewares directory does not exist!");
        return;
    }
    const middlewareFiles = fs.readdirSync(middlewaresDirectoryPath);

    const excludeMiddlewares = ["authMiddleware", "authSocketMiddleware"];

    let loadedAny = false;

    for (const middlewareFile of middlewareFiles) {
        const fullPath = path.join(middlewaresDirectoryPath, middlewareFile);
        const stat = fs.statSync(fullPath);
        if (!stat.isFile()) continue;

        if (!(middlewareFile.endsWith(".js") || middlewareFile.endsWith(".ts"))) continue;

        const baseName = path.basename(middlewareFile, path.extname(middlewareFile));
        if (excludeMiddlewares.includes(baseName)) continue;

        const mwModule = require(fullPath);
        const middleware: RequestHandler = mwModule.default || mwModule;
        if (typeof middleware !== "function") continue;

        if (!loadedAny) {
            logger.info("Started Loading Middlewares...");
            loadedAny = true;
        }

        app.use(middleware);
        logger.info(`${middlewareFile} Loaded!`);
    }

    if (loadedAny) {
        logger.info("Middlewares Loaded Successfully!");
    } else {
        logger.warn("There was no middleware to load!");
    }
};
