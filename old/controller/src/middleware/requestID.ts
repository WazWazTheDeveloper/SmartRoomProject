import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from "node:async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<TStorage>();
type TStorage = {
    requestID : string
}

/**
 * A middleware that adds a Request ID to each http request that can be accessed for everywhere
 */
export const addRequestID = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["x-request-id"]) {
        req._requestID = req.headers["x-request-id"] as string
    } else {
        req._requestID = uuidv4()
    }

    res.set("x-request-id", req._requestID)

    const store : TStorage = {
        requestID : req._requestID
    }
    asyncLocalStorage.run(store, () => {
        next();
    });

}

/**
 * Get Request-ID of the http request that initiated the function
 * @returns Request-ID of request
 */
export function getRequestUUID() {
    const store = asyncLocalStorage.getStore();
    if (store) {
        const uuid = store.requestID
        return uuid;
    } else {
        return "n/a"
    }
}