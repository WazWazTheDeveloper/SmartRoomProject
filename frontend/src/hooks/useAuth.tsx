import { AuthContext } from "@/providers/authProvider";
import { useContext } from "react";

export default function useAuth() {
    const currentAuthContext = useContext(AuthContext);

    if (!currentAuthContext) {
        throw new Error(
            "useAuth has to be used within <AuthContext.Provider>"
        );
    }

    return currentAuthContext;
}