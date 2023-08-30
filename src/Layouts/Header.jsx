import React from 'react'
import NavButtons from './NavButtons'
import { NavLink } from 'react-router-dom'



function Header() {
  return (
    <header className='relative z-10 h- w-full' id='header'>
      <NavBar />
    </header>
  )
}


export const NavBar = () => {

  return (

    <nav className={`flex justify-between items-center  w-full fixed z-2 bg-green-700`} >
    
      <NavLink to={"/"} >
      <img src="https://i.postimg.cc/Jz7k2pKv/Logo2.png" className='bg-green-900 p-2 rounded-full m-1 active:scale-110 transition-transform w-[40px] h-[40px]' alt="" />
      </NavLink>
      <ul className='flex'>
      <li>
      <NavButtons content="Productos" to="/products"/>
      </li>
      <li>
      <NavButtons content="Contactos" to="/contact"/>
      </li>
      </ul>
      </nav>
  )
}


export default Header