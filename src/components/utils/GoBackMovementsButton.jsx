import { Button, IconButton } from '@mui/material'
import { useMovementContext } from '../../hooks/useMovementsContext'
import { useGoTo } from '../../hooks/useGoTo'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
const GoBackMovementsButton = () => {
    const {goTo} = useGoTo()
    const {office } = useMovementContext()
  return (
    <IconButton variant='contained' onClick={() => goTo("/movements/" + office.id)}>{<ArrowBackIosNewIcon/>}</IconButton>
  )
}

export default GoBackMovementsButton