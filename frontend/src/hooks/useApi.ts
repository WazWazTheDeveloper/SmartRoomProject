import { useState } from "react";
import { ApiService } from "../services/apiService";
import { useAuth } from "./useAuth";

const useApi = (relativPath: string, metod: string) => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({});
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [userdata, login, logout, signup, updateUserData, authIsError, authError] = useAuth();

    const fetchWithReauth = async (token: string, payload: {} = {}) => {
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
                let refreshResponse = await ApiService.refreshToken()
                if (refreshResponse) {
                    if (refreshResponse.status === 200) {
                        let dataJson = await refreshResponse.json()
                        updateUserData(dataJson)

                        let response = await ApiService.basicHttpRequest(relativPath, metod, dataJson.token, payload)
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
                    else if (refreshResponse.status === 403) {
                        setIsLoading(false);
                        setIsError(true);
                        setError("Your login has expired. ")
                    } else if (refreshResponse.status === 204) {
                        setIsLoading(false);
                        setIsError(false);
                        setData("no data")
                    }
                }
            } else if (response.status === 204) {
                setIsLoading(false);
                setIsError(false);
                setData("no data")
            }
        }
    }

    const fetch = async (token: string, payload: {} = {}) => {
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

    const refreshToken = async (): Promise<void> => {
        setIsLoading(true);
        setData({});
        setIsError(false);
        setError("");
        let response = await ApiService.refreshToken()
        if (response) {
            if (response.status === 403) {
                console.log("yeet")
                // refreshResponse.body.message = "Your login has expired. "
                setIsLoading(false);
                setIsError(true);
                setError("Your login has expired. ")
            }
            if (response.status === 200) {
                let dataJson = await response.json()
                setIsLoading(false);
                setData(dataJson)
            }
        }
    }

    return [data, isLoading, isError, error, fetchWithReauth, refreshToken] as const
};

export { useApi }