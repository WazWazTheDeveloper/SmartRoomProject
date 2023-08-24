import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { ApiService } from '../../services/apiService';
import jwt_decode from "jwt-decode";
import usePersist from '../../hooks/usePersist';
// const jwt_decode = require('jwt-decode');

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

function AuthProvider({ children }: Props) {
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [permission, setPermission] = useState<Array<string>>([]);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');
    const [dataLogin, isLoadingLogin, isErrorLogin, errorLogin, fetchLogin, refreshToken] = useApi('/auth/', ApiService.REQUEST_POST);
    const [dataLogout, isLoadingLogout, isErrorLogout, errorLogout, fetchLogout] = useApi('/auth/logout', ApiService.REQUEST_POST);
    const [persist, setPersist] = usePersist();
    const [dataRefresh, isLoadingRefresh, isErrorRefresh, errorRefresh, fetchRefresh] = useApi('/auth/refresh', ApiService.REQUEST_POST);

    useEffect(() => {
        if (!token && persist) {
            refreshToken()
            console.log("asd")
        }
    }, [])


    useEffect(() => {
        if (!isLoadingLogin) {
            if (isErrorLogin) {
                setIsError(true)
                setError(errorLogin)
                console.log((errorLogin as any))
            }
            else {
                let token = (dataLogin as any).accessToken
                if (token) {
                    let decoded: any = jwt_decode(token)
                    setToken(token)
                    setUserName(decoded.userInfo.username)
                    setPermission(decoded.userInfo.permission)
                    setIsError(false)
                    setError("")
                    // setPersist(token);
                }
            }
        }
    }, [isLoadingLogin, isErrorLogin, errorLogin])

    useEffect(() => {
        if (!isLoadingLogout) {
            if (isErrorLogout) {
                // console.log(dataLogout)
                // console.log(isErrorLogout)
                // console.log(errorLogout)
                // setIsError(true)
                // setError(errorLogin)
                console.log((errorLogin as any))
            }
            else {
                // let token = (dataLogin as any).accessToken
                // if (token) {
                setToken("")
                setUserName("")
                setPermission([])
                setIsError(false)
                setError("")
                // }
            }
        }
    }, [isLoadingLogout, isErrorLogout, errorLogout])

    const updateUserData = (newUserData: UserDataType) => {
        return
    }

    const login = (username: string, password: string) => {
        let body = {
            username: username,
            password: password
        }
        fetchLogin(token, body)
    }

    const logout = () => {
        let body = {
        }
        fetchLogout(token, body)
    }

    const signup = (username: string, password: string) => {
        let body = {
            username: username,
            password: password
        }
        fetchLogin(token, body)
    }

    let userdata: UserDataType = {
        token, userName, permission
    }

    return (
        <AuthContext.Provider value={[userdata, login, logout, signup, updateUserData, isError, error]}>{children}</AuthContext.Provider>
    )
}

export { AuthProvider };