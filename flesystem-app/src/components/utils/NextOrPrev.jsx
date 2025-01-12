import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { IconButton } from "@mui/material";
import { useMovementContext } from "../../hooks/useMovementsContext";
import { useEffect, useState } from "react";

const NextOrPrev = ({operation}) => {
  const [info, setInfo] = useState(null);
  const {getNextOrPreviousPage, movementsInfo, isRentability, futureType} = useMovementContext();
  useEffect(() => {
    if (!movementsInfo || isRentability || futureType) return;
    const info = operation == "+" ? movementsInfo.incomes : movementsInfo.outcomes;
    if(!info.next?.includes("operation_type") && !info.previous?.includes("operation_type")){
      //Se cambia el + a %2B ya que en los query params el simbolo de "+" tiene otro significado y %2B es su codificacion
      info.next = info.next ? `${info.next}&operation_type=${operation == "+" ? "%2B" : operation}` : null;
      info.previous = info.previous ? `${info.previous}&operation_type=${operation}` : null;
    }
    operation == "+" ? setInfo(movementsInfo.incomes) : setInfo(movementsInfo.outcomes)  
  }, [movementsInfo, operation])
  return (
    info && <div className="flex justify-center w-full">
      <ArrowPairs disabled={Boolean(!info.previous)} onClick={() => getNextOrPreviousPage(info.previous, operation)} nextOrPrev="prev" />
      <ArrowPairs disabled={Boolean(!info.next)} onClick={() => getNextOrPreviousPage(info.next, operation)} nextOrPrev="next" />
    </div>
  );
};

export const ArrowPairs = ({disabled, onClick, nextOrPrev}) => {
  const Icon = nextOrPrev == "next" ? NavigateNextIcon : NavigateBeforeIcon;
  return (
      <IconButton disabled={disabled} onClick={onClick}>
        <Icon />
      </IconButton>
  );
}

export default NextOrPrev;
