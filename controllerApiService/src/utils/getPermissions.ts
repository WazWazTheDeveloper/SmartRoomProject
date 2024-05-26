import { AxiosResponse } from "axios";
import { getRequestUUID } from "../middleware/requestID";
import { loggerGeneral } from "../services/loggerService";

const axios = require('axios').default;

type TResponseData = {
    _id: string;
    isAdmin: boolean;
    permissions: TPermission[]
}
export type TPermission = {
    type: "topic" | "device" | "task" | "permissionGroup" | "users"
    objectId: string | "all"
    read: boolean
    write: boolean
    delete: boolean
}

type TResult  = {
    isSuccessful : false
} | {
    isSuccessful : true
    data : TResponseData
}

type TType = "topic" | "device" | "task" | "permissionGroup" | "users"
export async function getPermissions(authKey: string, userID: string, type: TType): Promise<TResult> {
    return await axios.get(`http://${process.env.ACCOUNT_SERVICE as string}/api/v1/user/${userID}/permission?permission_type=${type}`,
        {
            headers: {
                "X-Request-ID": getRequestUUID(),
                Authorization: authKey
            }
        })
        .then(function (response: AxiosResponse<TResponseData>) {
            if (response.status != 200) return false

            return response.data.permissions
        }).catch(function (error: any) {
            // handle error
            loggerGeneral.error(`failed to fetch permissions verifacation: ${error}`, { uuid: getRequestUUID() })
            return false;
        })
}