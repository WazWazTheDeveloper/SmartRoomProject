import { Request, Response, NextFunction } from 'express';
import { loggerRequest } from '../services/loggerService';
import { getTime } from 'date-fns';
import { asyncLocalStorage } from './addRequestID';

export const httpRequestLogger = (req: Request, res: Response, next: NextFunction) => {
    var start = getTime(new Date());

    if ((res as any)._responseTime) return next();
    (res as any)._responseTime = true;

    res.on('finish', function () {
        const duration = (getTime(new Date()) - start);
        let uuid = asyncLocalStorage.getStore()
        loggerRequest.info(`${req.method} ${req.url} ${req.headers.origin} status:${res.statusCode} response time:${duration}ms`, { uuid: getUUID() })
    });

    res.on('closed', function () {
        const duration = (getTime(new Date()) - start);
        loggerRequest.info(`${req.method} ${req.url} ${req.headers.origin} [connection closed]`, { uuid: getUUID() })
        console.log(duration)
    });

    next();
}

function getUUID() {
    const store = asyncLocalStorage.getStore();
    if (store) {
        const uuid = store.requestID
        return uuid;
    } else {
        return "n/a"
    }
}