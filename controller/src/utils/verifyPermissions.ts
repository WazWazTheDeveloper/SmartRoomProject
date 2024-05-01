import { AxiosResponse } from "axios";
import { getRequestUUID } from "../middleware/requestID";
import { loggerGeneral } from "../services/loggerService";

const axios = require('axios').default;

type TResponseData = {
    hasPermission: boolean
}
type TType = "topic" | "device" | "task" | "permissionGroup" | "users"
type TPermissionType = "read" | "write" | "delete"
export async function verifyPermissions(authKey: string, userID: string, type: TType, objectid: string, permission: TPermissionType,) : Promise<boolean> {
    return axios.get(`http://${process.env.ACCOUNT_SERVICE as string}/api/v1/user/${userID}/check-permission?type=${type}&objectid=${objectid}&permission=${permission}`,
        {
            headers: {
                "X-Request-ID": getRequestUUID(),
                Authorization: authKey
            }
        })
        .then(function (response: AxiosResponse<TResponseData>) {
            if (response.status != 200) return false

            return response.data.hasPermission
        }).catch(function (error: any) {
            // handle error
            loggerGeneral.error(`failed to fetch permissions verifacation: ${error}`, { uuid: getRequestUUID() })
            return false;
        })
}