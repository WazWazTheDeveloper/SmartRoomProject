import winston from 'winston';
import * as date from 'date-fns'
import { v4 as uuidv4 } from 'uuid';

const logFormat = winston.format.printf(({ level, message,service}) => {
    const dateTime = `${date.format(new Date(), 'HH:mm:ss dd/LL/yyyy')}`

    return `${dateTime}\t${uuidv4()}\t[${service}]\t${level}: ${message}`;
});

const loggerDBLevel = "silly"

export const loggerDB = winston.createLogger({
    level: loggerDBLevel,
    format: winston.format.json(),
    defaultMeta: { service: 'account-service' },
    transports: [
        new winston.transports.File({ filename: './logs/db_error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/db_info.log', level: 'info' }),
        new winston.transports.File({ filename: './logs/db_verbose.log', level: 'verbose' }),
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