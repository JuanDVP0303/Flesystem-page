import { MenuItem, TextField } from '@mui/material'
import propTypes from 'prop-types'
import { useMovementContext } from '../../hooks/useMovementsContext'

const BankSelect = ({defaultValues, disableFields}) => {
    const {office} = useMovementContext()
  return <TextField
          required
          fullWidth
          select
          defaultValue={defaultValues?.bank?.id || null}
          name="bank"
          id="operation_bank"
          variant="outlined"
          disabled={disableFields}
          label="Banco"
        >
          {office?.banks?.map((bank, index) => (
            <MenuItem key={index} value={bank.id}>
              {bank.name}
            </MenuItem>
          ))}
        </TextField>
 }

BankSelect.propTypes = {
    defaultValues: propTypes.object,
    disableFields: propTypes.bool
}

export default BankSelect