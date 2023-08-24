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
            else if(response.status === 403) {
                setIsLoading(false);
                setIsError(true);
                setError("Your login has expired. ")
            }else if(response.status === 204) {
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

    return [data, isLoading, isError, error,fetch,refreshToken] as const
};

export { useApi }