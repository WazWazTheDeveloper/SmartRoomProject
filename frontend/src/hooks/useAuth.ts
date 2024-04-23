import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

type user = {
    userID: string
}

export function useAuth() {
    const [isConnected, setIsConnected] = useState(false);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    const result = useQuery({
        queryKey: ['auth'],
        queryFn: () =>
            axios
                .get('https://127.0.0.1/')
                .then((res) => res.data),
    })
}