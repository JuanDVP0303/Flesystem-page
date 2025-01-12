import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import moment from 'moment'
import PropTypes from 'prop-types'

const DatePickerComponent = ({defaultValue, disableFields, name}) => {
  return (
    <>
    <h2 className='font-bold'>Fecha del movimiento</h2>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      disabled={disableFields}
      format="DD/MM/YYYY"
      defaultValue={
        defaultValue
          ? dayjs(moment(defaultValue.movement_date))
          : dayjs(new Date())
      }
      name={name}
      minDate={moment("1900-01-01")}
    />
  </LocalizationProvider>
  </>
  )
}

DatePickerComponent.propTypes = {
    defaultValue: PropTypes.object,
    disableFields: PropTypes.bool,
    name: PropTypes.string
}

export default DatePickerComponent