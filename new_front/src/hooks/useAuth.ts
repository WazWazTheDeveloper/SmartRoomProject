import { useContext} from "react";
import { AuthContext } from "../components/providers/authProvider";

const useAuth = () => {
    const currentAuthContext = useContext(AuthContext);

    if (!currentAuthContext) {
        throw new Error(
            "useAuth has to be used within <AuthContext.Provider>"
        );
    }

    return currentAuthContext;
};

export { useAuth }