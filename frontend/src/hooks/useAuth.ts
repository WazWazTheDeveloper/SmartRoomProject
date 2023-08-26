import { useContext} from "react";
import { AuthContext } from "../components/providers/authProvider";

const useAuth = () => {
    const currentAuthContext = useContext(AuthContext);

    if (!currentAuthContext) {
        throw new Error(
            "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        );
    }

    return currentAuthContext;
};

export { useAuth }