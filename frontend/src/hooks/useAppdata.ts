import { useContext} from "react";
import { AppdataContext } from "../components/providers/appdataProvider";

const useAppdata = () => {
    const currentAuthContext = useContext(AppdataContext);

    if (!currentAuthContext) {
        throw new Error(
            "useAppdata has to be used within <AppdataContext.Provider>"
        );
    }
    return currentAuthContext;
};

export { useAppdata }