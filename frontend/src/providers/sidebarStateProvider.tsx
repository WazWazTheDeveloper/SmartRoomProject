import { Dispatch, SetStateAction, createContext, useState } from "react";

type Props = {
    children: JSX.Element
}

export type ContextType = [
    isSidebarOpen : boolean,
    setIsSidebarOpen : Dispatch<SetStateAction<boolean>>
]

export const SidebarStateContext = createContext<ContextType | null>(null);

export function SidebarStateProvider({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
return(
    <SidebarStateContext.Provider value={[isSidebarOpen, setIsSidebarOpen]}>
        { children }
    </SidebarStateContext.Provider>
)
}
