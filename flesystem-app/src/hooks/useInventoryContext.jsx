import { useContext } from "react";
import { inventoryContext } from "../contexts/context";

export const useInventoryContext = () => useContext(inventoryContext)