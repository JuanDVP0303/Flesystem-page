import { useContext } from "react";
import { purchasesContext } from "../contexts/context";

export const usePurchaseContext = () => useContext(purchasesContext)