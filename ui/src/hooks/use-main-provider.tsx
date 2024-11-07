import { MainContext } from "@/providers/main-provider"
import { useContext } from "react"

export const useMainProvider = () => {
    const context = useContext(MainContext);

    if (!context) {
        throw new Error("useMainProvider must be used within a MainProvider");
    }

    return context;
}