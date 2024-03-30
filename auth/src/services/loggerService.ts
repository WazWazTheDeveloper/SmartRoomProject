import winston from 'winston';
import * as date from 'date-fns'
import { v4 as uuidv4 } from 'uuid';

const logFormat = winston.format.printf(({ level, message, service, uuid ,dateTime}) => {
    return `${dateTime}\t${uuid}\t[${service}]\t${level}: ${message}`;
});

const loggerDBLevel = "silly"
const requestLoggerLevel = "silly"

export const loggerDB = winston.createLogger({
    level: loggerDBLevel,
    format: winston.format.json(),
    defaultMeta: {
        service: 'auth-service',
        uuid: uuidv4(),
        dateTime: `${date.format(new Date(), 'HH:mm:ss dd/LL/yyyy')}`
    },
    transports: [
        new winston.transports.File({ filename: `./logs/db_error${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'error' }),
        new winston.transports.File({ filename: `./logs/db_info${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'info' }),
        new winston.transports.File({ filename: `./logs/db_verbose${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'verbose' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    loggerDB.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            logFormat
        ),
        level: 'silly'
    }));
}

export const loggerRequest = winston.createLogger({
    level: requestLoggerLevel,
    defaultMeta: {
        service: 'auth-service',
        uuid: uuidv4(),
        dateTime: `${date.format(new Date(), 'HH:mm:ss dd/LL/yyyy')}`
    },
    transports: [
        new winston.transports.File({ filename: `./logs/request_error${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'error' }),
        new winston.transports.File({ filename: `./logs/request_info${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'info' }),
        new winston.transports.File({ filename: `./logs/request_verbose${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'verbose' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                logFormat
            ),
            level: 'silly'
        })
    ],
});