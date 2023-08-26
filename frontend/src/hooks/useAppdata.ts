import { useContext} from "react";
import { AppdataContext } from "../components/providers/appdataProvider";

const useAppdata = () => {
    const currentAuthContext = useContext(AppdataContext);

    if (!currentAuthContext) {
        throw new Error(
            "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        );
        return
    }
    return currentAuthContext;
};

export { useAppdata }