import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import chalk from 'chalk';

class Logger {
    private logger: WinstonLogger;

    constructor(private serviceName: string = 'App') {
        this.logger = createLogger({
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(({ timestamp, level, message }) => {
                    let levelColored;
                    switch (level) {
                        case 'error':
                            levelColored = chalk.red(level.toUpperCase());
                            break;
                        case 'warn':
                            levelColored = chalk.yellow(level.toUpperCase());
                            break;
                        case 'info':
                            levelColored = chalk.green(level.toUpperCase());
                            break;
                        case 'debug':
                            levelColored = chalk.blue(level.toUpperCase());
                            break;
                        default:
                            levelColored = level.toUpperCase();
                    }

                    return `[${chalk.gray(timestamp)}] [${chalk.cyan(this.serviceName)}] [${levelColored}]: ${message}`;
                })
            ),
            transports: [
                new transports.Console()
            ],
        });
    }

    info(message: string): void {
        this.logger.info(message);
    }

    warn(message: string): void {
        this.logger.warn(message);
    }

    error(message: string): void {
        this.logger.error(message);
    }

    debug(message: string): void {
        this.logger.debug(message);
    }
}

export default Logger;