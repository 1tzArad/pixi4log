import path from "path";
import fs from "fs";
import Logger from "../utils/Logger";
import { Application } from "express";

const logger = new Logger("Routes-Handler");

export default (app: Application) => {
    const routesDirectoryPath = path.join(__dirname, "..", "routes");
    if (!fs.existsSync(routesDirectoryPath)) {
        logger.warn("Routes directory does not exist!");
        return;
    }
    const routeFiles = fs.readdirSync(routesDirectoryPath);
    let loadedAny = false;
    for (const routeFile of routeFiles) {
        const fullPath = path.join(routesDirectoryPath, routeFile);
        const stat = fs.statSync(fullPath);
        if (!stat.isFile()) continue;
        if (!(routeFile.endsWith(".js") || routeFile.endsWith(".ts"))) continue;
        const r = require(fullPath);
        if (!r.default || !(r.default.path && r.default.router)) continue;
        if (!loadedAny) {
            logger.info("Started Loading Routes...");
            loadedAny = true;
        }

        app.use(r.default.path, r.default.router);
        logger.info(`${routeFile} Loaded! (path: '${r.default.path}')`);
    }

    if (loadedAny) {
        logger.info("Routes Loaded Successfully!");
    } else {
        logger.warn("There was no route to load!");
    }
};
