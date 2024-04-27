"use client"

import { AuthProvider } from "@/providers/authProvider";
import { SidebarStateProvider } from "@/providers/sidebarStateProvider";
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"

export function Providers({ children }: any) {
    const [authTrigger, setAuthTrigger] = useState(false);

    const [queryClient] = useState(() =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    retry: (failureCount, err: any) => {
                        if (err.response?.status === 401) {
                            return false; // do not retry, trigger error
                        }

                        if (failureCount < 3) return true

                        return false;
                    },
                    onError: (err: any) => {
                        if (err.response?.status === 401) {
                            // clean up session state and prompt for login
                            // ex: window.location.reload();
                        }
                    }
                }
            }
        }))

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SidebarStateProvider>
                    {children}
                </SidebarStateProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}