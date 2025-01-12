import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import moment from "moment";

import PropTypes from "prop-types";
import { SmallButton } from "../../pages/Inventory/components/Buttons";
import { useMovementContext } from "../../hooks/useMovementsContext";
export const DateFilter = ({getFunction}) => {
    const { setFromDate, setToDate, fromDate, toDate } = useMovementContext();

    return <Box className="flex  items-center mt-4 gap-4"> <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box className="flex justify-center items-center gap-2">
      <DatePicker
        sx={{
            ".MuiInputBase-input":{
                p:"10px",
                width:"100%"
            },
            ".MuiInputBase-root":{
              borderRadius:"14px",
            },
        }}
        format="DD/MM/YYYY"
        label="Desde"
        value={dayjs(moment(fromDate))}
        onChange={(e) => {
          setFromDate(moment(new Date(e)).format("YYYY-MM-DD"));
        }}
        className="bg-white"
        defaultValue={dayjs(
          moment(new Date()).format("YYYY-MM-DD")
        ).subtract(1, "day")}
      />
      <span className="bg-gray-400 w-3 text-black h-[2px]"/>
      <DatePicker
              sx={{
                ".MuiInputBase-input":{
                    p:"10px",
                    width:"100%",
                },
                ".MuiInputBase-root":{
                  borderRadius:"14px",
                },
            }}
        format="DD/MM/YYYY"
        label="Hasta"
        className="bg-white rounded-md"
        value={dayjs(moment(toDate))}
        defaultValue={dayjs(moment(new Date()).format("YYYY-MM-DD"))}
        onChange={(e) => {
          setToDate(moment(new Date(e)).format("YYYY-MM-DD"));
        }}
          />
    </Box>
    <SmallButton
      className="self-center"
        variant="contained"
        size="small"
        label={"Filtrar"}
        onClick={() => {
        getFunction();
      }}
    />
  </LocalizationProvider>
  </Box>
  }

DateFilter.propTypes = {
    getFunction: PropTypes.func,
    setStateFrom: PropTypes.func,
    setStateTo: PropTypes.func,
  };
  