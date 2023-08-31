import {BrowserRouter , Route, Routes} from "react-router-dom"
import Layout from "./Layouts/Layout"
import Home from "./Home/Home"
import Contact from "./Contact/Contact"
import Products, { ProductDetail } from "./Products/Products"


export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={Layout}>
        <Route path="/" Component={Home}/>
        <Route path="/products" Component={Products}/>
        <Route path="/products/:productId" Component={ProductDetail}/>
        <Route path="/contact" Component={Contact}/>
        <Route path="*" element={<h1>Not Found </h1>}></Route>
      </Route>
    </Routes>
   </BrowserRouter>
  )
}

