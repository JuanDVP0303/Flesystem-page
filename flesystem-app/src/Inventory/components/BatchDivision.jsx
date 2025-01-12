import { useRef } from 'react'
import { ModalComponent } from '../../../src/components/utils/ModalComponent'
import { FieldGroup, GridField } from '../Inventory'
import { SaveButton } from './Buttons'
import { Box } from '@mui/material'
import { useInventoryContext } from '../../../src/hooks/useInventoryContext'
import { useGlobalContext } from '../../../src/hooks/useGlobalContext'
import propTypes from 'prop-types'


const BatchDivision = ({batch, open, setOpen}) => {
    const {batchDivision} = useInventoryContext()
    const divisionFormRef = useRef(null)
    const { office } = useGlobalContext();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = new FormData(divisionFormRef.current)
        form.append("batch", batch.batch)
        const values = Object.fromEntries(form.entries())
        const res = await batchDivision(values)
        if(res.status === 200){
            setOpen(false)   
        }
    }

    const onChange = (event) => {
        const { name, value } = event.target;
        if (divisionFormRef.current) {
            divisionFormRef.current[name].value = value; // Actualiza el valor del campo
        }
    };
    

    return (
        <ModalComponent open={open} setOpen={setOpen} fullWidth title={`Dividir el lote: "${batch.batch}"`}>
            <form onSubmit={handleSubmit} ref={divisionFormRef} className='p-5 pb-20'>
                <Box className="flex gap-4">
                <GridField>
                <FieldGroup
                    name={"division_quantity"}
                    label={`Cantidad a dividir [${batch.quantity}]`}
                    numeric={true}
                    value={divisionFormRef?.current?.division_quantity?.value}
                    required
                    onChange={onChange}
                    />
                </GridField>
                <GridField>
                <FieldGroup
                    onChange={onChange}
                    name={"location"}
                    label={"Ubicación"}
                    value={divisionFormRef?.current?.location?.value}
                    />
                </GridField>
                </Box>
                <div className='flex justify-center mt-10'>
                <SaveButton label="Dividir lote" />                    
                </div>
            </form>
        </ModalComponent>
    )
}

export default BatchDivision


BatchDivision.propTypes = {
    batch: propTypes.object,
    open: propTypes.bool,
    setOpen: propTypes.func
}