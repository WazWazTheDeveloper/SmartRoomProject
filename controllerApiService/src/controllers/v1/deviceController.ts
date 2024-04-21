import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import { problemDetails } from "../../models/problemDetails";
import { response401 } from "../../models/errors/401";
import { verifyPermissions } from "../../utils/verifyPermissions";


export const updateDevices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const getDeviceWithArray = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const getAlldevices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const deleteDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const getDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const updateDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})