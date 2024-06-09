import { Request, Response, NextFunction } from 'express';
import { loggerRequest } from '../services/loggerService';
import { getTime } from 'date-fns';
import { getRequestUUID } from './requestID';

/**
 * A middle ware that logs each http request after complition
 */
export const httpRequestLogger = (req: Request, res: Response, next: NextFunction) => {
    var start = getTime(new Date());

    if ((res as any)._responseTime) return next();
    (res as any)._responseTime = true;

    res.on('finish', function () {
        const duration = (getTime(new Date()) - start);
        loggerRequest.info(`${req.method} ${req.url} ${req.headers.origin} status:${res.statusCode} response time:${duration}ms`, { uuid: getRequestUUID() })
    });

    res.on('closed', function () {
        const duration = (getTime(new Date()) - start);
        loggerRequest.info(`${req.method} ${req.url} ${req.headers.origin} [connection closed]`, { uuid: getRequestUUID() })
        console.log(duration)
    });

    next();
}