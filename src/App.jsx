import { Route, Routes } from "react-router-dom"
import ErrorPage from "./pages/error/ErrorPage"
import Dashboard from "./pages/dashboard/Dashboard"
import LoginPage from "./pages/login/LoginPage"
import SidebarMenu from "./components/sidebar/SidebarMenu"
import AddCategory from "./pages/category/AddCategory"
import ViewCategory from "./pages/category/ViewCategory"
import AddProduct from "./pages/product/AddProduct"
import ViewProduct from "./pages/product/ViewProduct"

function App() {

  return (
    <>

      
      <Routes>

        <Route index path="/" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<Dashboard />} >
        
          <Route path="add-category" element={ <AddCategory/>} />
          <Route path="view-category" element={<ViewCategory />} />
          
          <Route path="add-product" element={ <AddProduct/>} />
          <Route path="view-product" element={<ViewProduct />} />

        </Route>
        
        
        <Route path="*" element={<ErrorPage />} />
        
      </Routes>
    </>
  )
}

export default App