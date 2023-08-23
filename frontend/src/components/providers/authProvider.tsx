import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { ApiService } from '../../services/apiService';
import jwt_decode from "jwt-decode";
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
    updateUserData : (newUserData:any) => void
]

export const AuthContext = createContext<ContextType | null>(null);

function AuthProvider({ children }: Props) {
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [permission, setPermission] = useState<Array<string>>([]);
    const [dataLogin, isLoadingLogin, isErrorLogin, errorLogin,fetchLogin] = useApi('/auth/',ApiService.REQUEST_POST);
    const [dataRefresh, isLoadingRefresh, isErrorRefresh, errorRefresh,fetchRefresh] = useApi('/auth/refresh',ApiService.REQUEST_GET);
    const [dataLogout, isLoadingLogout, isErrorLogout, errorLogout,fetchLogout] = useApi('/auth/logout',ApiService.REQUEST_POST);
    console.log(token)
    console.log(userName)
    console.log(permission)
    useEffect(() =>{
        let token = (dataLogin as any).accessToken
        if(token){
            let decoded:any = jwt_decode(token)
            setToken(token)
            setUserName(decoded.userInfo.username)
            setPermission(decoded.userInfo.permission)
        }
    },[dataLogin])
    
    const updateUserData = (newUserData:UserDataType) => {
        return
    }

    const login= (username: string, password: string) => {
        let body = {
            username: username,
            password: password
        }
        fetchLogin(token,body)
    }

    const logout = () => {
    }

    let userdata:UserDataType = {
        token, userName, permission
    }

    return (
        <AuthContext.Provider value={[userdata, login, logout,updateUserData]}>{children}</AuthContext.Provider>
    )
}

export { AuthProvider };