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

export type ContextType = {
    login: (username : string , password:string) => void;
    refreshToken: () => void;
    logout: () => void;
    authToken: string;
    isAuthed: boolean;
    isLoading: boolean;
    errors: string[]
}

export const AuthContext = createContext<ContextType | null>(null);

export function AuthProvider({ children }: Props) {
    const [authToken, setAuthToken] = useState("")
    const [isAuthed, setIsAuthed] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [errors, serErrors] = useState<string[]>([])
    const currentPage = usePathname();

    const loginMutation = useMutation({
        mutationFn: async (user: TLogin) => {
            const res = await axios.post('/api/v1/auth/login', {
                withCredentials: true,
                username: user.password,
                password: user.username,
            })
            console.log(res.data)
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
            console.log(res.data)
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
        // login.mutate({
        //     password: "admin",
        //     username: "admin"
        // })
        logoutMutation.mutate()
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

    const login = (username : string , password:string) => {
        loginMutation.mutate({
            username : username,
            password : password
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
        errors
    }

    return (
        <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    )
}