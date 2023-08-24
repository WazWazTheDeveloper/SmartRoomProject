import React, { createContext, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { useAuth } from '../../hooks/useAuth';

type Props = {
    children: JSX.Element
}

export type ApiContextType = [
    data: {},
    isLoading: boolean,
    isError: boolean,
    error: string,
    fetch: (relativPath: string, metod: string, token: string, payload: {}) => void
]


export const ApiContext = createContext<ApiContextType | null>(null);

function ApiProvider({ children }: Props) {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [userdata, login, logout, signup, updateUserData, authIsError, authError] = useAuth();

    const fetchWithReAuth = async (relativPath: string, metod: string, token: string, payload: {}): Promise<void> => {
        setIsLoading(true);
        setData({});
        setIsError(false);
        setError("");
        let response = await ApiService.basicHttpRequest(relativPath, metod, token, payload)
        if (response) {
            if (response.status === 403) {
                console.log('sending refresh token')
                const refreshResponse = await ApiService.refreshToken()
                if (refreshResponse.status == 200) {
                    let responseJson = await refreshResponse.json()
                    updateUserData({
                        token: (responseJson as any).token,
                        userName: (responseJson as any).UserInfo.username,
                        permission: (responseJson as any).UserInfo.permission
                    });
                    response = await ApiService.basicHttpRequest(relativPath, metod, (responseJson as any).token, payload)
                } else {

                    if (refreshResponse.status === 403) {
                        console.log("yeet")
                        // refreshResponse.body.message = "Your login has expired. "
                    }
                    setIsError(true);
                    setError("Your login has expired.");
                    setData(await refreshResponse.json())
                }
            }
            setIsLoading(false);
            setData(await response.json());
        }
    }
    return (
        <ApiContext.Provider value={[data, isLoading, isError, error, fetchWithReAuth]}>{children}</ApiContext.Provider>
    )
}

export { ApiProvider };