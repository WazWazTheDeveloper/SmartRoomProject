import { Express } from "express-serve-static-core";

declare module "express-serve-static-core" {
    interface Request {
        _requestID: string
        _userName: string
        _userID: string
    }
}