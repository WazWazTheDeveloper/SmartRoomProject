import { SidebarStateContext } from "@/providers/sidebarStateProvider";
import { useContext } from "react";

export default function useSidebarState() {
    const currentSidebarStateContext = useContext(SidebarStateContext);

    if (!currentSidebarStateContext) {
        throw new Error(
            "useSidebarState has to be used within <AuthContext.Provider>"
        );
    }

    return currentSidebarStateContext;
}