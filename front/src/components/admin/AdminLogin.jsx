import React, { useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AdminLogin = () => {

  useEffect=(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Belle Chic - Admin Login');
  })
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:4000/users/admin", values);

        if (response.status === 200) {
          alert("Login successful");
          navigate('/admin/home');
          localStorage.setItem("token", response.data.token); // Store the received token
        } else if (response.status === 401) {
          alert("Incorrect email or password");
        } else if (response.status === 404) {
          alert("User not found");
        } else {
          alert("Error during login");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error during login. Please try again.");
      }
    },
  });

  const navigate = useNavigate();

  return (
    <>
      <div className="container d-flex justify-content-center p-5 mt-5">
        <div className="card p-5 size-login shadow">
          <form className="row g-3" onSubmit={formik.handleSubmit}>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="example@gmail.com" />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger">{formik.errors.email}</div>
              )}
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="password" />
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger">{formik.errors.password}</div>
              )}
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <div className="col-12">
              <div className="row">   
                <div className="col-md-6">
                  <Link to='/admin/signup'>Create an Account</Link>
                </div>
                <div className="col-md-6 text-right text-end">
                  <Link to='/admin/adminForget'> Forget Password</Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
