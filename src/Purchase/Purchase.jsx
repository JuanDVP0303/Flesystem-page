import {
  Autocomplete,
  Box,
  Button,
  FormLabel,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useGlobalContext } from "../../src/hooks/useGlobalContext";
import { GenericButton } from "../Inventory/components/Buttons";
import StoreIcon from "@mui/icons-material/Store";
import { ModalComponent } from "../components/utils/ModalComponent";
import { usePurchaseContext } from "../hooks/usePurchasesContext";
import { useEffect, useRef, useState } from "react";
import TableGenerator from "../components/utils/TableGenerator";
export const genericBlue = "#1adb00";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FieldGroup, GridField } from "../Inventory/Inventory";
import { useInventoryContext } from "../hooks/useInventoryContext";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const Purchase = () => {
  const { authenticatedUser } = useGlobalContext();
  const { setPurchasesModalType, getProviders, getOrders, orders } = usePurchaseContext();

  useEffect(() => {
    getProviders();
    getOrders();
  }, []);

  return (
    <Box
      sx={{
        width: "95%",
        margin: "auto",
      }}
    >
      <MiniCard>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            padding: "10px",
            flexWrap: "wrap",
          }}
        >
          <Box className="flex items-center text-[#00db00]">
            <StoreIcon />
            <span className={`text-xl font-bold text-[${genericBlue}]`}>
              Compras
            </span>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}></Box>
        </Box>
      </MiniCard>

      {!authenticatedUser.is_superuser && (
        <MiniCard>
          <div className="flex flex-col md:flex-row justify-center gap-5">
            <GenericButton
              onClick={() => {
                setPurchasesModalType("providers");
              }}
              outlined
              label={
                <>
                  Proveedores&nbsp;
                  <LocalShippingIcon />
                </>
              }
            />
            <GenericButton
              onClick={() => {
                setPurchasesModalType("purchase");
              }}
              label={
                <>
                  Generar compra&nbsp;
                  <StoreIcon />
                </>
              }
            />
          </div>
        </MiniCard>
      )}
      <MiniCard>
        <Box className="flex flex-col md:flex-row justify-center gap-5">
        <TableGenerator
              labels={["Número de factura", "Producto", "Proveedor", "Costo Total"]}
              data={orders || []}
              rowFields={["invoice_number", "product_name", "provider_name", "total_cost"]}
            />
        </Box>
      </MiniCard>
      <PurchaseModal />
    </Box>
  );
};
const PurchaseModal = () => {
  const { purchasesModalType, setPurchasesModalType } = usePurchaseContext();
  return (
    <ModalComponent
      fullScreen={true}
      title={`${
        purchasesModalType === "providers" ? "Proveedores" : "Generar compra"
      }`}
      open={Boolean(purchasesModalType)}
      setOpen={setPurchasesModalType}
    >
      {purchasesModalType === "providers" ? (
        <ProviderSection />
      ) : (
        <PurchaseSection />
      )}
    </ModalComponent>
  );
};

const PurchaseSection = () => {
  
  const [formValues, setFormValues] = useState({
    provider: null,
    product: null,
    quantity: 0,
    price_unit: 0,
    total_cost: 0,
    purchase_date: "",
    invoice_number: "",
  });
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState([]);
  const { searchProductDebounce } = useInventoryContext();
  const { setPurchasesModalType, getOrders } = usePurchaseContext();
  const formRef = useRef();

  const createPurchase = async () => {
    let res;
    try{
      res = await api.post("/purchase/orders/create-order/", {
        ...formValues,
        product: formValues.product?.id,
        provider: provider?.id,
      });
    }catch(e){
      res = e.response
    }
    
    if (res.status === 201) {
      toast.success("Compra creada exitosamente");
      setPurchasesModalType(null);
      getOrders();
    }
    else{
      toast.error("Error al crear la compra");
    }
  }

  const searchProviders = async (search) => {
    if (search.length > 0) {
      const response = await api.get(
        `/purchase/providers/get-providers?name=${search}`
      );
      const data = response?.data;
      console.log("DATA", data);
      // const response = await fetch(`http://localhost:8000/api/purchases/purchase/?search=${search}`)
      setProviders(
        response?.data?.map((provider) => {
          return {
            ...provider,
            label: provider?.name,
          };
        })
      );
    } else {
      setProviders([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  useEffect(() => {
    setFormValues(prev => {
      return {
        ...prev,
        total_cost: formValues.quantity * formValues.price_unit
      }
    })
  }, [formValues.quantity, formValues.price_unit]);	

  return (
    <Box className="p-5">
      <form
        ref={formRef}
        onSubmit={(e) => {
          createPurchase();
          e.preventDefault();
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={4}>
            <GridField>
              <div className="flex flex-col flex-1">
                <FormLabel>Proveedor</FormLabel>
                <Autocomplete
                  freeSolo={providers?.length === 0}
                  onChange={(e, value) => {
                    handleChange({
                      target: { name: "provider", value: value },
                    });
                    if (value) {
                      const productInSearch = providers?.find(
                        (product) => product?.name === value?.name
                      );
                      if (productInSearch) {
                        setProvider(productInSearch);
                      } else {
                        setProvider(null);
                      }
                    }
                  }}
                  required={true}
                  variant="outlined"
                  size="medium"
                  // disabled={false}
                  value={formValues.provider || null}
                  name={"provider"}
                  options={providers}
                  renderInput={(params) => (
                    <>
                      <TextField
                        {...params}
                        // endAdornment={endAdornment}
                        placeholder={"Ex:. Proveedor S.A."}
                        InputProps={{
                          ...params.InputProps,
                          name: "provider",
                          type: "text",
                          onChange: (e) => {
                            searchProviders(e?.target?.value);
                            handleChange(e);
                            setProvider(null);
                          },
                        }}
                      />
                    </>
                  )}
                />
              </div>
              <FieldGroup
                onChange={handleChange}
                value={formValues.purchase_date}
                name="purchase_date"
                required={true}
                label="Fecha de compra"
                type="date"
              />
              <FieldGroup
                onChange={handleChange}
                value={formValues.invoice_number}
                name="invoice_number"
                optional={true}
                label="Número de factura"
                placeholder="Ex:. 001-123456"
              />
            </GridField>
            <GridField>
              <FieldGroup
                onChange={handleChange}
                value={formValues.product}
                name="product"
                required={true}
                searchFunction={searchProductDebounce}
                label="Producto"
                placeholder="Buscar producto"
                disableShowProduct={false}
              />
              <FieldGroup
                onChange={handleChange}
                value={formValues.quantity}
                name="quantity"
                required={true}
                label="Cantidad"
                numeric={true}
                placeholder="Ex:. 100"
              />
              <FieldGroup
                onChange={handleChange}
                value={formValues.unit_cost}
                name="price_unit"
                required={true}
                label="Costo unitario"
                numeric={true}
                placeholder="Ex:. 50.00"
              />
            </GridField>
            <div className="px-8 pt-5">
              <FieldGroup
                onChange={handleChange}
                value={formValues.total_cost}
                name="total_cost"
                disabled={true}
                label="Costo total"
                placeholder="Calculado automáticamente"
              />
            </div>
          </Grid>
          <Box mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button type="submit" variant="outlined" color="primary">
                  Agregar producto
                </Button>
              </Grid>
              {/* <Grid item xs={12}>
        <PurchaseOrderSummary
          products={formValues.products}
          onRemove={handleRemoveProduct}
        />
      </Grid> */}
            </Grid>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

const ProviderSection = () => {
  //options: str: view | str: add | int: idOfProvider
  const [state, setState] = useState("view");
  const [providersToShow, setProvidersToShow] = useState(null);
  const { providers } = usePurchaseContext();
  useEffect(() => {
    setProvidersToShow(
      providers.map((provider) => {
        return {
          ...provider,
          action: (
            <IconButton
              onClick={() => {
                setState(provider.id);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          ),
        };
      })
    );
  }, [providers]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
      }}
    >
      <MiniCard>
        <Box className="flex flex-col md:flex-row justify-center gap-5">
          <GenericButton
            outlined={state == "view"}
            label="Ver proveedores"
            onClick={() => {
              setState("view");
            }}
          />
          <GenericButton
            outlined={state == "add"}
            label="Agregar proveedor"
            onClick={() => {
              setState("add");
            }}
          />
        </Box>
        {state == "view" && (
          <Box>
            <TableGenerator
              labels={["Nombre", "Correo", "Dirección", "Teléfono", "Acciones"]}
              data={providersToShow || []}
              rowFields={["name", "email", "address", "phone", "action"]}
            />
          </Box>
        )}
        {state == "add" || !isNaN(state) ? (
            <Box>
              <ProvidersView state={state} />
            </Box>
           ): null}
      </MiniCard>
    </Box>
  );
};

const ProvidersView = ({ state }) => {
  const { createProvider, getProvider, editProvider, provider, setProvider } =
    usePurchaseContext();

    useEffect(() => {return () => setProvider(null)}, [])
  const formRef = useRef();
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const providerData = {};
    formData.forEach((value, key) => {
      providerData[key] = value;
    });
    if (provider) {
      providerData.id = state;
    }
    if (state == "add") {
      createProvider(providerData);
    } else {
      editProvider(providerData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProvider((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    //Verificar si state es un numero
    if (!isNaN(state)) {
      // Buscar el proveedor con ese id
      getProvider(state);
    }
  }, [state]);

  return (
    <Box>
      <MiniCard>
        <form
          ref={formRef}
          onSubmit={(e) => {
            onSubmit(e);
          }}
        >
          <Box>
            <GridField agrouped={true}>
              <FieldGroup
                onChange={handleChange}
                label="Nombre"
                name="name"
                required
                value={provider ? provider.name : ""}
              />
              <FieldGroup
                onChange={handleChange}
                label="Email"
                name="email"
                required
                value={provider ? provider.email : ""}
              />
            </GridField>
            <GridField agrouped={true}>
              <FieldGroup
                onChange={handleChange}
                label="Teléfono"
                name="phone"
                required
                value={provider ? provider.phone : ""}
              />
              <FieldGroup
                onChange={handleChange}
                label="Dirección"
                name="address"
                required
                value={provider ? provider.address : ""}
              />
            </GridField>
            {/* <FieldGroup label="Email" required /> */}
          </Box>
          <Box className="flex justify-center my-4">
            <GenericButton
              label={provider ? "Editar proveedor" : "Agregar proveedor"}
              type="submit"
            />
          </Box>
        </form>
      </MiniCard>
    </Box>
  );
};

export const MiniCard = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: 1.5,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "20px",
        my: "10px",
      }}
    >
      {children}
    </Box>
  );
};

export default Purchase;
