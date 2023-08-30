import { Outlet } from "react-router-dom"
import Header from "./Header"
import React from "react"
import Footer from "./Footer"

function Layout() {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
)
}

export default Layout