import React, { createContext, useState, useEffect } from 'react';
import { ApiService } from '../../services/apiService';
import jwt_decode from "jwt-decode";

type Props = {
    children: JSX.Element
}
type UserDataType = {

    token: string,
    userName: string,
    permission: Array<string>
}
export type ContextType = [
    userdata: UserDataType,
    login: (username: string, password: string) => void,
    logout: () => void,
    signup: (username: string, password: string) => void,
    updateUserData: (newUserData: any) => void,
    isError: boolean,
    error: string
]

export const AuthContext = createContext<ContextType | null>(null);

// TODO: fix this claster-fuck :)
function AuthProvider({ children }: Props) {
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [permission, setPermission] = useState<Array<string>>([]);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({});
    // DEL
    // const [dataLogin, isLoadingLogin, isErrorLogin, errorLogin, fetchLogin, refreshToken] = useApi('/auth/', ApiService.REQUEST_POST);
    // const [dataLogout, isLoadingLogout, isErrorLogout, errorLogout, fetchLogout] = useApi('/auth/logout', ApiService.REQUEST_POST);
    // const [dataSignup, isLoadingSignup, isErrorSignup, errorSignup, fetchSignup] = useApi('/auth/signup', ApiService.REQUEST_POST);

    useEffect(() => {
        if (token == "") {
            refreshToken()
        }
    }, [])

    useEffect(() => {
        console.log(token)
    }, [token])

    useEffect(() => {
        if (!isLoading) {
            if (!isError) {
                let token = (data as any).accessToken
                if (token) {
                    let decoded: any = jwt_decode(token)
                    setToken(token)
                    setUserName(decoded.userInfo.username)
                    setPermission(decoded.userInfo.permission)
                    setIsError(false)
                    setError("")
                }
                else {
                    setToken("")
                    setUserName("")
                    setPermission([])
                    setIsError(false)
                    setError("")
                }
            }
        }
    }, [isLoading, isError])

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


    // DEL
    // useEffect(() => {
    //     if (!isLoadingLogin) {
    //         if (isErrorLogin) {
    //             setIsError(true)
    //             setError(errorLogin)
    //             console.log((errorLogin as any))
    //         }
    //         else {
    //             let token = (dataLogin as any).accessToken
    //             if (token) {
    //                 let decoded: any = jwt_decode(token)
    //                 setToken(token)
    //                 setUserName(decoded.userInfo.username)
    //                 setPermission(decoded.userInfo.permission)
    //                 setIsError(false)
    //                 setError("")
    //             }
    //         }
    //     }
    // }, [isLoadingLogin, isErrorLogin, errorLogin])

    // useEffect(() => {
    //     if (!isLoadingLogout) {
    //         if (isErrorLogout) {
    //             console.log((errorLogin as any))
    //         }
    //         else {
    //             setToken("")
    //             setUserName("")
    //             setPermission([])
    //             setIsError(false)
    //             setError("")
    //         }
    //     }
    // }, [isLoadingLogout, isErrorLogout, errorLogout])

    const updateUserData = (newUserData: UserDataType) => {
        setToken(newUserData.token)
        setUserName(newUserData.userName)
        setPermission(newUserData.permission)
    }

    const login = (username: string, password: string) => {
        let body = {
            username: username,
            password: password
        }
        fetch('/auth/', ApiService.REQUEST_POST)
    }

    const logout = () => {
        let body = {
        }
        fetch('/auth/logout', ApiService.REQUEST_POST)
    }

    const signup = (username: string, password: string) => {
        let body = {
            username: username,
            password: password
        }
        fetch('/auth/signup', ApiService.REQUEST_POST)
    }


    const fetch = async (relativPath: string, metod: string) => {
        setIsLoading(true);
        setData({})
        setIsError(false);
        setError("");
        let response = await ApiService.basicHttpRequest(relativPath, metod, "", {})
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

    let userdata: UserDataType = {
        token, userName, permission
    }

    return (
        <AuthContext.Provider value={[userdata, login, logout, signup, updateUserData, isError, error]}>{children}</AuthContext.Provider>
    )
}

export { AuthProvider };