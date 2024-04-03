import express, { Request, Response } from "express"
import * as userService from '../../services/userService'
// IMPLEMENT
export async function getUserPermissions(req: Request, res: Response) {

}

export async function updateUserPermissions(req: Request, res: Response) {
    const { UUID } = req.params
    const { permissionOptions } = req.body

    if (typeof (UUID) != "string" || !Array.isArray(permissionOptions)) {
        res.status(400).json('Bad request')
        return
    }

    if (!userService.isPermissionsOptions(permissionOptions)) {
        res.status(400).json('Bad request')
    }

    const result: boolean = await userService.updateUserPermissions(UUID, permissionOptions)

    if (result) {
        res.status(200).json('ok')
        return
    }
    res.status(500).json('internal server error')
    return
}