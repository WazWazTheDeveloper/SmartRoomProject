import { useState } from "react";
import { useAuth } from "./useAuth";
import { ApiService } from "../services/apiService";

const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({});
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [userdata, login, logout, signup, updateUserData, authIsError, authError] = useAuth();

    const refreshToken = async (): Promise<any> => {
        let response = await ApiService.refreshToken()
        if (response) {
            console.log(response.status)
            if (response.status === 200) {
                let dataJson = await response.json()
                updateUserData(dataJson.accessToken)
                return dataJson
            }
            else if (response.status === 403) {
                setIsLoading(false);
                setIsError(true);
                setError("Your login has expired. ")
                return {}
            } else if (response.status === 204) {
                setIsLoading(false);
                setIsError(false);
                setData("no data")
                return {}
            }
        }
        return {}
    }

    const fetchWithReauth = async (relativPath: string, metod: string, token: string, payload: {} = {}) => {
        setIsLoading(true);
        setData({})
        setIsError(false);
        setError("");
        let response = await ApiService.basicHttpRequest(relativPath, metod, token, payload)
        if (response) {
            if (response.status === 200) {
                let dataJson = await response.json()
                setIsLoading(false);
                setData(dataJson)
            }
            else if (response.status === 403) {
                let refreshTokenData = await refreshToken();

                if(Object.keys(refreshTokenData).length != 0 ) {
                    let response = await ApiService.basicHttpRequest(relativPath, metod, refreshTokenData.accessToken, payload)
                    if (response) {
                        if (response.status === 200) {
                            let dataJson = await response.json()
                            setIsLoading(false);
                            setData(dataJson)
                        }
                        else if (response.status === 403) {
                            setIsLoading(false);
                            setIsError(true);
                            setError("Your login has expired. ")
                        } else if (response.status === 204) {
                            setIsLoading(false);
                            setIsError(false);
                            setData("no data")
                        }
                    }
                }
            } else if (response.status === 204) {
                setIsLoading(false);
                setIsError(false);
                setData("no data")
            }
        }
    }

    return [data, isLoading, isError, error, fetchWithReauth] as const
}

export { useApi }