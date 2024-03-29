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
    defaultMeta: { service: 'auth-service' },
    transports: [
        new winston.transports.File({ filename: `./logs/auth_error${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'error' }),
        new winston.transports.File({ filename: `./logs/auth_info${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'info' }),
        new winston.transports.File({ filename: `./logs/auth_verbose${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'verbose' }),
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