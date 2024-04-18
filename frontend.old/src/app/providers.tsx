'use client';

import { AppdataProvider } from "@/components/providers/appdataProvider";
import { AuthProvider } from "@/components/providers/authProvider";

export function Providers({ children }: any) {
    return (
        <AuthProvider>
            <AppdataProvider>
                {children}
            </AppdataProvider>
        </AuthProvider>
    )
}