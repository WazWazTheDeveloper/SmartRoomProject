import express, { NextFunction, Request, Response } from "express"
import { WebSocketServerHandler } from "../handlers/webSocketServerHandler"

const updateWebSocket = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        WebSocketServerHandler.updateAppdata();
    })
    next();
}

export { updateWebSocket }
