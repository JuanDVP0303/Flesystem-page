import { TextField } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import propTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { formatNumber } from '../../utils/methods';

export const NumericField = ({name, label, defaultValues, defaultNumber, disableFields}) => {
  const [formattedValue, setFormattedValue] = useState('');
  useEffect(() => {
    // Inicializar el valor formateado
    const initialValue = defaultNumber || defaultValues?.amount || '';
    if (initialValue) setFormattedValue(formatNumber(initialValue));
  }, [defaultNumber, defaultValues]);

  // const formatNumber = (value) => {
  //   // Asegurarse de que el valor es un número
  //   const numValue = parseFloat(value);
  //   if (isNaN(numValue)) return '';
    
  //   // Formatear el número con separadores de miles y decimales
  //   return numValue.toLocaleString('es-VE', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //     useGrouping: true,
  //   }).replace(/\./g, ',').replace(/,/g, '.');
  // };

  const handleValueChange = (values) => {
    const { formattedValue } = values;
    setFormattedValue(formattedValue);
  };
console.log(formattedValue)

  return (
    <NumericFormat
      fullWidth
      label={label}
      name={name} 
      disabled={disableFields}
      value={formattedValue}
      thousandSeparator="."
      decimalSeparator=","
      customInput={TextField}
      variant="outlined"
      valueIsNumericString={false}
      onValueChange={handleValueChange}
      isNumericString={false}
    />
  )
}

NumericField.propTypes = {
    name: propTypes.string,
    label: propTypes.string,
    defaultValues: propTypes.object,
    disableFields: propTypes.bool,
    defaultNumber: propTypes.number
}