import { Button } from "@mui/material"
import propTypes from 'prop-types'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

export const  SaveButton = ({label, disabled, type, onClick, ...props} ) => {
    return <Button type={type ? type : "submit"} disabled={disabled} className={disabled ? "" : "strong_green_button"}  sx={{color:"white", px:2}} onClick={onClick}
    {...props}
    >{label}</Button>
}

export const GenericButton = ({onClick, label, outlined, small, ...props}) => {
    return <Button
    variant={outlined ? "outlined" : "contained"}
    className={`${outlined ? "outlined_button" : "inventory-income-button"} `}
    onClick={onClick}
    sx={{ borderRadius: "10px", px: small ? 1 : 4, py: small ? 0.2 : 1, minWidth: small ? "auto" : "250px",
        border: outlined ? "1px solid #1adb00" : "none",
        color: outlined ? "#1adb00" : "none",
     }}
    {...props}
  >
    {label}
  </Button>
}


export const SmallButton = ({onClick, label, className}) => {

    return<Button size='small' sx={{
        color:"white",
        width:"100px",
    }} className={`smart-blue-button ${className}`} onClick={onClick}>
        {label}
    </Button>
}

// export const ExchangeButton = ({func}) => {
//     const {office, setCurrencySelected} = useMovementContext()
//     return <GenericButton small label={
//         <div className="flex items-center flex-col">
//           {/* Dólares */}
//           <CurrencyExchangeIcon />
//         </div>
//       } outlined onClick={() => {
//         setCurrencySelected(prev => prev ? prev == office?.main_currency ? "usd" : office?.main_currency : "usd")


//           // setCurrencySelected(prev => prev != office?.main_currency && prev != null ? office?.main_currency : !prev ? office?.main_currency : "usd")
//         func()

//       }} />
// }


GenericButton.propTypes = {
    label: propTypes.oneOfType([
        propTypes.string,
        propTypes.node
      ]),
    onClick: propTypes.func,
    outlined: propTypes.bool,
    small: propTypes.bool
}
    
SmallButton.propTypes = {
    label: propTypes.string,
    onClick: propTypes.func
}


SaveButton.propTypes = {
    label: propTypes.string,
    disabled: propTypes.bool,
    type: propTypes.string,
    onClick: propTypes.func
}