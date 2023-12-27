import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import Dashboard from './Dashboard'
import Otp from './Otp'
import Forget from './Forget'
import ChangePass from './ChangePass'
import Product from './Product'
import Cart from './Cart'
import Wishlist from './Wishlist'
import ContactUs from './ContactUs'
import DisplayPolicy from './DisplayPolicy'
import DisplayTerms from './DisplayTerms'
import DisplayAbout from './DisplayAbout'
import BlogMain from './displayBlog/BlogMain'
import BlogDetails from './displayBlog/BlogDetails'

export default function Main() {

  return (
    <div>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/otp' element={<Otp/>}/>
        <Route path='/forget' element={<Forget/>}/>
        <Route path ='/resetPass/:token' element={<ChangePass/>}/>
        <Route path ='/product' element={<Product/>}/>
        <Route path ='/addToCart/:id' element={<Cart/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/contactUs' element={<ContactUs/>}/>
        <Route path='/privacyPolicy' element={<DisplayPolicy/>}/>
        <Route path='/termsConditions' element={<DisplayTerms/>}/>
        <Route path='/aboutUs' element={<DisplayAbout/>}/>
        <Route path='/blogs' element={<BlogMain/>}/>
        <Route path='/blogs/:blogId' element={<BlogDetails/>}/>

      </Routes>

    </div>
  )
}
