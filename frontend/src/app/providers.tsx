"use client"

import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

export function Providers({ children }: any) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}