import winston from 'winston';
import * as date from 'date-fns'

const logFormat = winston.format.printf(({ level, message, service, uuid ,dateTime}) => {
    return `${dateTime}\t${uuid}\t[${service}]\t${level}: ${message}`;
});

const loggerDBLevel = "silly"
const loggerMQTTLevel = "silly"
const requestLoggerLevel = "silly"
const serviceName = "controller-service"

export const loggerDB = winston.createLogger({
    level: loggerDBLevel,
    format: winston.format.json(),
    defaultMeta: {
        service: serviceName,
        uuid: "none",
        dateTime: `${date.format(new Date(), 'HH:mm:ss dd/LL/yyyy')}`
    },
    transports: [
        new winston.transports.File({ filename: `./logs/db_error${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'error' }),
        new winston.transports.File({ filename: `./logs/db_info${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'info' }),
        new winston.transports.File({ filename: `./logs/db_verbose${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'verbose' }),
    ],
});

export const loggerMQTT = winston.createLogger({
    level: loggerMQTTLevel,
    format: winston.format.json(),
    defaultMeta: {
        service: serviceName,
        uuid: "none",
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

    loggerMQTT.add(new winston.transports.Console({
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
        service: serviceName,
        uuid: "none",
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

export const loggerGeneral = winston.createLogger({
    level: requestLoggerLevel,
    defaultMeta: {
        service: 'account-service',
        uuid: "none",
        dateTime: `${date.format(new Date(), 'HH:mm:ss dd/LL/yyyy')}`
    },
    
    transports: [
        new winston.transports.File({ filename: `./logs/general_error${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'error' }),
        new winston.transports.File({ filename: `./logs/general_info${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'info' }),
        new winston.transports.File({ filename: `./logs/general_verbose${date.format(new Date(), '_dd_LL_yyyy')}.log`, level: 'verbose' }),
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