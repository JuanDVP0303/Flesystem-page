import React from "react"
import {BrowserRouter , Route, Routes} from "react-router-dom"
import Layout from "./Layouts/Layout"
import Home from "./LandingComponents/Home"
import Contact from "./LandingComponents/Contact"
import Products, { ProductDetail } from "./LandingComponents/Products"
import About from "./LandingComponents/About"


export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={Layout}>
        <Route path="/" Component={Home}/>
        <Route path="/about" Component={About}/>
        <Route path="/products" Component={Products}/>
        <Route path="/products/:productId" Component={ProductDetail}/>
        <Route path="/contact" Component={Contact}/>
        <Route path="*" element={<h1>Not Found </h1>}></Route>
      </Route>
    </Routes>
   </BrowserRouter>
  )
}

