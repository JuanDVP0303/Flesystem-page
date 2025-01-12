import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useGoTo = () => {
    const navigate = useNavigate()
    const goTo = useCallback((path) => {
        navigate(path);
    }, [navigate]);
    
    return { goTo };
}