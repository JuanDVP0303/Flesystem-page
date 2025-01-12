import { Button, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { api } from '../../src/utils/api'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useGoTo } from '../../src/hooks/useGoTo';
import { useGlobalContext } from '../../src/hooks/useGlobalContext';
import { SaveButton } from '../Inventory/components/Buttons';

function RegisterBrain(){
  const { goTo } = useGoTo()
  const { setAuthenticatedUser } = useGlobalContext()
  const formRef = useRef(null)
  const registerUser = async () => {
    const formData = new FormData(formRef.current);
    console.log(Object.fromEntries(formData))
    let res;
    try{
      res = await api.post("/users/create-user/", formData)
      const data = await res.data
      if (res.status === 201) {
        localStorage.setItem('account_token', data.access_token)
        setAuthenticatedUser(data.account)
        localStorage.setItem('account_json', JSON.stringify(data.account))
        toast.success('Usuario creado correctamente')
        goTo('/')
      }
    }
    catch(err){
      toast.error('Error: Ya existe una cuenta con ese email o tienes datos erroneos')
    }
  }



  return <>
    <Register formRef={formRef} registerUser={registerUser} />
  </>
}


function Register({formRef, registerUser}) {
  return (
    <article>
        <form className='authSubContainer' ref={formRef} onSubmit={(e) => {
          e.preventDefault()
          registerUser()
          
          }}> 
          <h2 className='title'>Registrate</h2>
          <TextField fullWidth label="E-mail" variant="outlined" name="email" required />
          <TextField fullWidth label="Contraseña" type='password' name="password" variant="outlined" required />
          <SaveButton variant="contained" color="primary" type='submit' label={"Registrarse"}/>
          <Link to="/login" className='font-light'>
          ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </form>
    </article>
  )
}


Register.propTypes = {
  formRef: PropTypes.object,
  countries: PropTypes.array,
  registerUser: PropTypes.func,
  setCountryCode: PropTypes.func,
  countryCode: PropTypes.string
}

export default RegisterBrain