import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import { problemDetails } from "../../models/problemDetails";
import { response401 } from "../../models/errors/401";
import { verifyPermissions } from "../../utils/verifyPermissions";


export const createTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const getTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})