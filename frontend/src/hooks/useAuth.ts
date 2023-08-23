import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Logout } from "@mui/icons-material";
import { AuthContext } from "../components/providers/authProvider";

// function useAuth() {
//     const [token, setToken] = useState("");
//     const [userName, setUserName] = useState("");
//     const [permission, setPermission] = useState<Array<string>>([]);

//     useEffect(() => {
//         function handleStateChange(token: string, userName: string, permission: Array<string>):void {
//             setToken(token);
//             setUserName(userName);
//             setPermission(permission);
//         }
//         let [_token, _userName, _permission] = AuthService.getAuth();
//         handleStateChange(_token, _userName, _permission);
//         console.log("yeet")
//         let id =uuidv4()
//         AuthService.subscribe(handleStateChange,id);
//         return () => {
//             AuthService.unsubscribe(handleStateChange,id);
//         }

//     },[])

//     function login(username:string, password: string) {

//     }

//     function logout() {

//     }

//     let userdata = {
//         token, userName, permission
//     }

//     return [userdata , login, logout]
// }

const useAuth = () => {
    const currentAuthContext = useContext(AuthContext);

    if (!currentAuthContext) {
        throw new Error(
            "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        );
    }

    return currentAuthContext;
};

export { useAuth }