import { InputBase } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { genericBlue } from '../Inventory';

function SearchBar({searchFunction, label}) {
  return (
    <div>
    <InputBase
      onChange={(e) => {
        searchFunction(e.target.value);
      }}
      size="small"
      type="text"
      sx={{
        border: 1,
        borderRadius: 2,
        px: 2,
        borderColor: "#1adb00",
        width: "100%",
      }}
      placeholder={label}
      endAdornment={<SearchIcon sx={{ color: genericBlue }} />}
    />
  </div>
  )
}

export default SearchBar