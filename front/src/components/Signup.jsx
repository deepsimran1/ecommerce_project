import React, { useState,useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Otp from "./Otp";

import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function Signup() {
  
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Sign up');
  })

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
  });
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name',values.name);
        formData.append('email',values.email);
        formData.append('password',values.password);
        // for(let i=0; i<state.images?.length;i++){
        //   formData.append('images',state.images[i]);
        // }
        const response = await axios.post("http://localhost:4000/users/submitForm", formData,{
          headers:{
            "Content-Type":"multipart/form-data",
          }
        });
      console.log('Form values',values);
        if(response.status === 201 && response.data.otpSent){
          console.log("OTP sent success");
          alert("Otp sent successfully");
          setOtpSent(true);
       
         
        }
        alert("Save");
        navigate('/otp', {state:{email:values.email}});
        setState({ 
          name: '',
         email: '',
          password: ''
         }); 
      } 
      catch (error) {
        if(error.response && error.response.status === 409){
          alert("user already exists")
        }else{
          console.error("Error:", error);
        }
      }
    },
  });


  const navigate = useNavigate();
  const [state, setState] = useState({
     name: '',
      email: '',
       password: '',
      });
      const [otpSent, setOtpSent] = useState(false); 
  

  
  if (otpSent) {
    return <Otp />;
}


  return (
    <>
    <title>Signup</title>
    <div className="container d-flex justify-content-center p-5">
      <div className="card p-5 shadow size-login">
      <form className="row g-3" onSubmit={formik.handleSubmit}>
        <div className="col-md-12">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} placeholder="enter your name" />
          {formik.touched.name && formik.errors.name && (
  <div className="text-danger">{formik.errors.name}</div>
)}
        </div>
        <div className="col-md-12">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} placeholder="example@gmail.com" />
          {formik.touched.email && formik.errors.email && (
  <div className="text-danger">{formik.errors.email}</div>
)}
        </div>
        <div className="col-md-12">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} placeholder="password" />
          {formik.touched.password && formik.errors.password && (
  <div className="text-danger">{formik.errors.password}</div>
)}
        </div>
        <div className="col-12 login-btn">
          <button type="submit" className="btn col-12 mt-2 mb-2">SIGN UP</button>
        </div>
      </form>
      </div>
    </div>
    </>
  );
 
}
//twan hugk ciui fghn