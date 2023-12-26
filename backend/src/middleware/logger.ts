
import { Express, Request, Response, NextFunction } from 'express';
import * as date from 'date-fns'
import fs from'fs';
import fsPromises from 'fs/promises';
import path from 'path'
import { v4 as uuidv4 } from 'uuid';

const logEvents =async (message:any , logFIlesName:any) => {
        const dateTime = `${date.format(new Date(),'HH:mm:ss dd/LL/yyyy')}`
        const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`

        try {
            if(!fs.existsSync(`${"./logs"}`)){
                await fsPromises.mkdir("logs")
            }
            await fsPromises.appendFile(`./logs/${logFIlesName}`,logItem)
        } catch (err) {
            console.log(err)
        }
}

const logger = (req: Request, res: Response, next: NextFunction) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,`reqLog.log`)
    console.log(`${req.method} ${req.path}`)
    next();
}

export {logger, logEvents}