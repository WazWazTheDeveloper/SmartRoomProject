import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from "node:async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<TStorage>();
type TStorage = {
    requestID : string
}

export const addRequestID = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["X-Request-ID"]) {
        req._requestID = req.headers["X-Request-ID"] as string
    } else {
        req._requestID = uuidv4()
    }

    res.set("X-Request-ID", req._requestID)

    const store : TStorage = {
        requestID : uuidv4()
    }
    asyncLocalStorage.run(store, () => {
        next();
    });

}