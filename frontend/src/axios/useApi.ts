import { useContext } from "react";
import { ApiContext } from "./ApiProvider";

export function useApi() {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error("useApi trebuie folosit în interiorul ApiProvider");
    }

    return context;
}
