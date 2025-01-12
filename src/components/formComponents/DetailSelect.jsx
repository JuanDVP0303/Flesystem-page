import { Autocomplete, Button, IconButton, TextField } from "@mui/material"
import { useMovementContext } from "../../hooks/useMovementsContext"
import { useState } from "react";
import { ModalComponent } from "../utils/ModalComponent";
import AddIcon from "@mui/icons-material/Add";
import propTypes from 'prop-types'
import { SaveButton } from "../../pages/Inventory/components/Buttons";
const DetailSelect = ({disableFields, defaultValues, label, name}) => {
  const {categories, createCategory} = useMovementContext()
  const [openCategory, setOpenCategory] = useState(false);
  console.log("CATEGORIES", categories)
  return <>
  <ModalComponent open={openCategory} setOpen={setOpenCategory}>
        <h2 className="subTitle text-center">Agregar categoria</h2>
        <form
          className="form"
          onSubmit={(e) => {
            createCategory(e);
            setOpenCategory(false);
          }}
        >
          <TextField
            required
            fullWidth
            label="Categoria"
            name="name"
            variant="outlined"
          />
          <SaveButton label={"Guardar"} type="submit" variant="contained" size="small" sx={{ mt: 4 }}/>
        </form>
      </ModalComponent>
      {console.log("CATEGORIAS",categories)}
  <Autocomplete
    fullWidth
    disabled={disableFields}
    defaultValue={
      (defaultValues &&
        categories.find(
          (c) => c?.id == defaultValues?.detail?.id
        )) ||
      null
    }
    options={categories}
    getOptionLabel={(option) => option.name}
    renderInput={(params) => (
      <div className="flex w-full gap-5">
        <TextField
          {...params}
          label={label}
          variant="outlined"
          name={name}
        />
        <IconButton onClick={() => setOpenCategory(true)}>
          <AddIcon />
        </IconButton>
      </div>
    )}
  />
  </>  
 }

DetailSelect.propTypes = {
    disableFields: propTypes.bool,
    defaultValues: propTypes.object,
    label: propTypes.string,
    name: propTypes.string,
    setRecharge: propTypes.func
    }

export default DetailSelect