import { FormLabel, MenuItem, Select, TextField } from '@mui/material'
import propTypes from "prop-types"
const SelectField = ({options, label, name, onChange}) => {
  return (
    <>
        <FormLabel>{label}</FormLabel>
        <Select
            label={label}
            fullWidth
            variant="outlined"
            name={name}
            defaultValue={null}
            onChange={onChange}
            >
            {options.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
            </Select>
    </>
    )
}

SelectField.propTypes = {
    options: propTypes.array.isRequired,
    label: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    onChange: propTypes.func
}

export default SelectField