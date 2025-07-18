import express from "express";
import * as http from "node:http";
import chalk from 'chalk';
import configuration from "./utils/configuration";
import Logger from "./utils/Logger";
import routerHandler from "./handlers/routerHandler";
import middlewareHandler from "./handlers/middlewareHandler";
import compression from "compression";
import helmet from "helmet";
import { dataSource } from "./database/dataSource";

const app = express();
const server = http.createServer(app);
const logger = new Logger("APP");

logger.debug("Starting application initialization");


app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(express.urlencoded({ extended: true }))

logger.debug("Middlewares applied: json, compression, helmet, urlencoded");

// handlers
middlewareHandler(app);
logger.debug("Middleware handler executed");

routerHandler(app);
logger.debug("Router handler executed");

// database
dataSource.initialize()
    .then(() => {
        new Logger("Database").info(`Data Source has been initialized!`);
        logger.debug("Database initialized successfully");
    })
    .catch((error) => {
        new Logger('Database').error("Error during Data Source initialization:" + error);
    });

server.listen(configuration.port, () => {
    logger.info("Server listening on port " + configuration.port);
});

// Anti-Crash handlers with logs
process.on("unhandledRejection", (reason, p) => {
    logger.error("Unhandled Rejection/Catch");
    console.log(
        chalk.gray("————————————————————————————————————————————————————")
    );
    console.log(
        chalk.white("["),
        chalk.red.bold("AntiCrash"),
        chalk.white("]"),
        chalk.gray(" : "),
        chalk.white.bold("Unhandled Rejection/Catch")
    );
    console.log(
        chalk.gray("————————————————————————————————————————————————————")
    );
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    logger.error("Uncaught Exception/Catch");
    console.log(
        chalk.gray("————————————————————————————————————————————————————")
    );
    console.log(
        chalk.white("["),
        chalk.red.bold("AntiCrash"),
        chalk.white("]"),
        chalk.gray(" : "),
        chalk.white.bold("Uncaught Exception/Catch")
    );
    console.log(
        chalk.gray("————————————————————————————————————————————————————")
    );
    console.log(err, origin);
});
