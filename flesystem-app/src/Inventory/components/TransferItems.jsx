import { ModalComponent } from "../../../src/components/utils/ModalComponent"
import propTypes from "prop-types"
import {useInventoryContext} from "../../../src/hooks/useInventoryContext"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { GridField } from "../Inventory"
import SelectField from "./SelectField"
import { Box, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useGlobalContext } from "../../../src/hooks/useGlobalContext"
import { getProductQuantityByUnit } from "../../../src/utils/methods"
import { SaveButton } from "./Buttons"
import { useParams } from "react-router-dom"
const TransferItems = ({open, setOpen}) => {
  const {id, branch_office_id} = useParams()
  const [locations, setLocations] = useState([])
  const [productsToTransfer, setProductsToTransfer] = useState([])
  const [locationsProducts, setLocationsProducts] = useState([])
  const [destinyLocation, setDestinyLocation] = useState(null)
  const [originLocation, setOriginLocation] = useState(null)
  const {getLocations, getProductsByLocation, transferProducts} = useInventoryContext()
  const {office} = useGlobalContext()
  const handleOriginLocation= (e) => {
    setOriginLocation(e.target.value)
    getProductsByLocation(e.target.value).then(res => {
      if (res.status === 200){
        setLocationsProducts(res.data)
      }
      else{
        toast.error("No se pudieron obtener los productos de la ubicación")
      }
    })
  }

  const handleDestinyLocation = (e) => {
    setDestinyLocation(e.target.value)
  }

  const handleTransferProducts =async () => {
    for (const product of productsToTransfer){
      if(product.quantity < 0 || product.quantity > product.total_quantity){
        toast.error(`La cantidad a transferir de "${product.product__name}" no puede ser mayor a la cantidad actual (${product.total_quantity}) o menor a 0`)
        return
      }
    }

    const data = {
      products: productsToTransfer,
      destiny_location: destinyLocation,
      origin_location: originLocation
    }
    let res;
    try{
      res = await transferProducts(data)
    }
    catch(err){
      res = err.response
    }


    if (res && res.status === 200){
      toast.success("Productos transferidos exitosamente")
      setOpen(false)
    }
    else{
      toast.error("No se pudieron transferir los productos")
    }
  }

  useEffect(() => {
    if(!office) return
    getLocations(id, branch_office_id).then(res => {
      if (res && res.status === 200){
        setLocations(res.data)
      }
      else{
        toast.error("No se pudieron obtener las ubicaciones")
      }
    })
  }, [office])


  return (
    <ModalComponent title={"Transferir items a otras ubicaciones"} open={open} setOpen={setOpen} fullHeight>
      <Box sx={{display:"flex", gap:4, m:2}}>
        
      <GridField >
        <SelectField options={locations} name="origin_location" label="Ubicación de origen" onChange={handleOriginLocation}/>
      </GridField>
      <GridField>
        <SelectField options={locations} name="destiny_location" label="Ubicación destino" onChange={handleDestinyLocation}/>
      </GridField>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Cantidad a transferir</TableCell>
              <TableCell>Unidad</TableCell>
            </TableRow>
          </TableHead> 
          <TableBody>
          {locationsProducts.length > 0 && locationsProducts.map((product, index) => (
            
              <ProductTransferTableRow key={product.id} product={product} setProductsToTransfer={setProductsToTransfer}/>

            ) )}  
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center m-4">
        <SaveButton type={"button"} label={"Transferir"} onClick={handleTransferProducts} disabled={productsToTransfer.length == 0 || !destinyLocation}/>
      </div>
    </ModalComponent>
)
}


const ProductTransferTableRow = ({product, setProductsToTransfer}) => {
  const [checked, setChecked] = useState(false)
  return (
    <TableRow>
      <TableCell>
        <Checkbox onChange={() => {
          setChecked(!checked)
          setProductsToTransfer((prev) => {
            if(checked){
              return prev.filter(item => item.id !== product.id)
            }
            return [...prev, product]
          })
        }} />
      </TableCell>
      <TableCell>{product.product_variant__name || product.product__name}</TableCell>
      <TableCell>{product.quantity}</TableCell>
      <TableCell>
        <TextField disabled={!checked} type="number" size="small" defaultValue={product.quantity} onChange={() => {
          setProductsToTransfer((prev) => {
            return prev.map(item => {
              if(item.id === product.id){
                return {...item, quantity: event.target.value}
              }
              return item
            })})}}
        />
      </TableCell>
      <TableCell>{getProductQuantityByUnit(product, false, true)}</TableCell>
    </TableRow>
  )
}

ProductTransferTableRow.propTypes = {
  product: propTypes.object.isRequired,
  setProductsToTransfer: propTypes.func.isRequired
}

TransferItems.propTypes = {
    open: propTypes.bool.isRequired,
    setOpen: propTypes.func.isRequired
    }

export default TransferItems