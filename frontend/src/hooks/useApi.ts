import { error } from "console";
import { useCallback, useContext, useEffect, useState } from "react";
import { ApiContext } from "../components/providers/apiProvider";
import { ApiService } from "../services/apiService";

// function useApi(_token: string) {
//     const [token, setToken] = useState(_token);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [isError, setIsError] = useState(false);
//     const [error, setError] = useState("");
    
//     let url = "";
//     useEffect(() => {
//         fetch(url, {
//             method: "POST", // *GET, POST, PUT, DELETE, etc.
//             credentials: "include", // include, *same-origin, omit
//             headers: {
//                 "Content-Type": "application/json",
//                 "authorization" : token
//                 // 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             // body: JSON.stringify(data), // body data type must match "Content-Type" header
//         }).then((res:Response) => {

//         }).catch((error) => {

//         })
//     }, [])
// }

const useApi = (relativPath: string, metod: string) => {
    // const currentAuthContext = useContext(ApiContext);

    // if (!currentAuthContext) {
    //     throw new Error(
    //         "useCurrentUser has to be used within <CurrentUserContext.Provider>"
    //     );
    // }

    // return currentAuthContext;

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({});
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");

    const fetch = async(token: string, payload: {} = {}) => {
        setIsLoading(true);
        setData({})
        setIsError(false);
        setError("");
        let response = await ApiService.basicHttpRequest(relativPath,metod,token,payload)
        if (response) {
            if (response.status === 200) {
                let dataJson = await response.json()
                setIsLoading(false);
                setData(dataJson)
            }
            if(response.status === 403) {
                setIsLoading(true);
                setIsError(true);
                setError("Your login has expired. ")
            }
        }
    }

    return [data, isLoading, isError, error,fetch] as const
};

export { useApi }