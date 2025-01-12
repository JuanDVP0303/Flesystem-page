import { IconButton } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types"

const CloseButton = ({onClick}) => {
  return (
    <IconButton size='small' sx={{background:"rgba(0,0,0,0.1)"}} onClick={onClick}>
        <CloseIcon />
    </IconButton>
  )
}

CloseButton.propTypes = {
    onClick: PropTypes.func
}



export default CloseButton