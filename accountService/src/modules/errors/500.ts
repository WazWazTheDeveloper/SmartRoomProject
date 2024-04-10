import express, { Request, Response } from "express"
import { problemDetails } from "../problemDetails"
export function response505(req: Request, res: Response) {
    return res.status(500).json(problemDetails({
        type: "about:blank",
        title: "Internal server error",
        details: "An unexpected error occurred while processing your request. Please try again later.",
        instance: req.originalUrl,
    }))
}