import express, { Request, Response } from "express"
import { problemDetails } from "../problemDetails"
export function response401(req: Request, res: Response) {
    res.status(401).json(problemDetails({
        type: "about:blank",
        title: "Unauthorized",
        details: "User is not authorized to do this function",
        instance: req.originalUrl,
    }))
}