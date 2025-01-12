import { useState } from "react";
import { purchasesContext } from "./context";
import PropTypes from 'prop-types'
import { api } from "../utils/api";
import { toast } from "react-toastify";

const PurchasesProvider = ({ children }) => {
    const [purchasesModalType, setPurchasesModalType] = useState(null)
    const [providers, setProviders] = useState([])
    const [provider, setProvider] = useState(null)
    const [orders, setOrders] = useState([])
    const createProvider = (provider) => {
        api.post('/purchase/providers/', provider).then(res => {
            if(res.status === 201){
                setPurchasesModalType(null)
                setProviders(prev => [...prev, res.data])
                toast.success("Proveedor creado con éxito")
            }
            else{
                const data = res.response.data
                for (const key in data) {
                    toast.error(`${key}: ${data[key]}`)
                }
            }
        }).catch(err => {
            console.log(err)
            toast.error("Hubo un error al crear el proveedor :(")
        })
    }

    const getProviders = () => {
        api.get('/purchase/providers/').then(res => {
            if(res.status === 200){
                setProviders(res.data)
            }
            else{
                toast.error("Hubo un error al obtener los proveedores")
            }
        }).catch(err => {
            console.log(err)
            toast.error("Hubo un error al obtener los proveedores")
        })
    }

    const getProvider = (id) => {
        api.get(`/purchase/providers/${id}`).then(res => {
            if(res.status === 200){
                setProvider(res.data)
            }
            else{
                toast.error("Hubo un error al obtener el proveedor")
            }
        }).catch(err => {
            console.log(err)
            toast.error("Hubo un error al obtener el proveedor")
            return err.response
        })
    }

    const editProvider = (providerToEdit) => {
        api.put('/purchase/providers/'+providerToEdit?.id+"/", providerToEdit).then(res => {
            if(res.status === 200){
                setPurchasesModalType(null)
                setProviders(prev => prev.map(p => p.id === providerToEdit.id ? res.data : p))
                toast.success("Proveedor editado con éxito")
            }
            else{
                const data = res.response.data
                for (const key in data) {
                    toast.error(`${key}: ${data[key]}`)
                }
            }
        }).catch(err => {
            console.log(err)
            toast.error("Hubo un error al editar el proveedor :(")
        })
    }

    const getOrders = async () => {
        try {
            const res = await api.get('/purchase/orders/get-orders/')
            if(res.status === 200){
                setOrders(res.data)
                return res.data
            }
            else{
                toast.error("Hubo un error al obtener las órdenes")
            }
        } catch (error) {
            console.log(error)
            toast.error("Hubo un error al obtener las órdenes")
        }
    }

    const values = {
        purchasesModalType,
        providers,
        provider,
        setPurchasesModalType,
        createProvider,
        getProviders,
        getProvider,
        editProvider,
        setProvider,
        getOrders,
        orders
    }
    return (
    <purchasesContext.Provider value={values}>{children}</purchasesContext.Provider>
)
}

PurchasesProvider.propTypes = {
    children: PropTypes.node
}
export default PurchasesProvider