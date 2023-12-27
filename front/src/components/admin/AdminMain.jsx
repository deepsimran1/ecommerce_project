import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminHome from './AdminHome'
import AdminLogin from './AdminLogin'
import AdminSignup from './adminSignup'
import AdminForget from './adminForget'
import VerifyEmail from './VerifyEmail'
import AdminProfile from './AdminProfile'
import AdminProducts from './AdminProducts'
import EditProduct from './EditProduct'
import Customers from './Customers'
import EditCustomer from './EditCustomer'
import ProductForm from '../ProductForm'
import AddCustomer from './AddCustomer'
import Policy from './Policy'
import Terms from './Terms'
import AboutUs from './AboutUs'
import ContactUser from './ContactUser'
import CreateBlog from '../blog/CreateBlog'
import AdminBlogs from '../blog/AdminBlogs'
import AllBlogs from '../blog/AllBlogs'
import EditBlog from '../blog/EditBlog'

export default function AdminMain() {
  return (
    <>
        <Routes>
            <Route path ='/admin' element={<AdminLogin/>}/>
            <Route path= '/admin/home' element={<AdminHome/>}/>
            <Route path='/admin/signup' element={<AdminSignup/>}/>
            <Route path='/admin/forget' element={<AdminForget/>}/>
            <Route path='/admin/verifyEmail' element={<VerifyEmail/>}/>
            <Route path='/admin/adminForget' element={<AdminForget/>}/>
            <Route path='/admin/profile' element={<AdminProfile/>}/>
            <Route path='/admin/products' element={<AdminProducts/>}/>
            <Route path='/admin/editProduct/:productId' element={<EditProduct/>}/>
            <Route path='/admin/customers' element={<Customers/>}/>
            <Route path='/admin/editCustomer/:userId' element={<EditCustomer/>}/>
            <Route path='/admin/addproduct' element={<ProductForm/>}/>
            <Route path='/admin/addCustomer' element={<AddCustomer/>}/>
            <Route path='/admin/policy' element={<Policy/>}/>
            <Route path='/admin/termsConditions' element={<Terms/>}/>
            <Route path='/admin/aboutus' element={<AboutUs/>}/>
            <Route path='/admin/contactUser' element={<ContactUser/>}/>
            <Route path='/admin/createBlog' element={<CreateBlog/>}/>
            <Route path='/admin/adminBlogs' element={<AdminBlogs/>}/>
            <Route path='/admin/allBlogs' element={<AllBlogs/>}/>
            <Route path='/admin/editBlog/:blogId' element={<EditBlog/>}/>
        </Routes>
    </>
  )
}
