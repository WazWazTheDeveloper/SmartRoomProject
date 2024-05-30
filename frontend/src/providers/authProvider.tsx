import axios from "axios"
import { redirect, usePathname } from "next/navigation"
import { useEffect, useState, createContext } from "react"
import { UseMutationResult, useMutation } from "react-query"
type Props = {
    children: JSX.Element
}

type refreshType = {
    accessToken: string
}

type TLogin = {
    username: string,
    password: string,
}

type JWTData = {
    userdata: {
        username: string
        userID: string
    }
}

export type ContextType = {
    login: (username: string, password: string) => void;
    refreshToken: () => void;
    logout: () => void;
    authToken: string;
    isAuthed: boolean;
    isLoading: boolean;
    errors: string[];
    userID:string;
}

export const AuthContext = createContext<ContextType | null>(null);

export function AuthProvider({ children }: Props) {
    const [authToken, setAuthToken] = useState("")
    const [userID, setUserID] = useState("")
    const [isAuthed, setIsAuthed] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [errors, serErrors] = useState<string[]>([])
    const currentPage = usePathname();

    function parseJWT(token : string) {
        //I have no clue why, i copied it from stackoverflow
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as JWTData
    }

    const loginMutation = useMutation({
        mutationFn: async (user: TLogin) => {
            const res = await axios.post('/api/v1/auth/login', {
                withCredentials: true,
                username: user.password,
                password: user.username,
            })
            setUserID(parseJWT(res.data.accessToken).userdata.userID)
            setAuthToken(res.data.accessToken)
            setIsAuthed(true)
            setIsLoading(false);
            return res.data as refreshType
        },
        onError: async (e) => {
            console.log(e)
        }
    })

    const refreshTokenMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.get('/api/v1/auth/refresh', {
                withCredentials: true,
            })
            setUserID(parseJWT(res.data.accessToken).userdata.userID)
            setAuthToken(res.data.accessToken)
            setIsAuthed(true)
            setIsLoading(false);
            return res.data as refreshType
        },
        onError: async (err: any) => {
            if (err.response?.status === 401) {
                setAuthToken("")
                setIsAuthed(false)
                setIsLoading(false);
                // logout.mutate()
            }
        }
    })

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.delete('/api/v1/auth/logout', {
                withCredentials: true,
            })
            setAuthToken("")
            setIsAuthed(false)
            setIsLoading(false);
            return res.data as refreshType
        }
    })


    useEffect(() => {
        refreshTokenMutation.mutate()
    }, [])

    useEffect(() => {
        if (isLoading) return
        if (isAuthed) return
        if (currentPage == "/login") return

        redirect("/login")
    }, [isAuthed, isLoading])

    const logout = () => {
        logoutMutation.mutate();
    }

    const login = (username: string, password: string) => {
        loginMutation.mutate({
            username: username,
            password: password
        });
    }

    const refreshToken = () => {
        refreshTokenMutation.mutate();
    }

    const auth = {
        login,
        refreshToken,
        logout,
        authToken,
        isAuthed,
        isLoading,
        errors,
        userID
    }

    return (
        <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    )
}