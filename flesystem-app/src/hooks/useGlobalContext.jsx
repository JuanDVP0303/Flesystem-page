import { useContext } from "react";
import { globalContext } from "../contexts/context";

export const useGlobalContext = () => useContext(globalContext)
