import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    message: Yup.string().required('Please write a message, comment, reason for contacting us...'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:4000/users/addContactMessage", values);

        if (response.status === 201) {
          alert('Form submitted successfully');
          navigate('/');
        } else {
          alert("Error submitting form");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error submitting form. Please try again.");
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center p-5">
      <div className="card p-5 shadow col-lg-8 col-md-10 col-sm-12">
        <h3 className='text-center p-3'>Contact Us</h3>
        <p className='text-center pb-5'>Questions or comments about this page? Feel free to send our support team a message via the form below and we'll be happy to help you out.</p>

        <form className="row g-3" onSubmit={formik.handleSubmit}>
          <div className="col-6">
            <div className="form-floating">
              <input type="text" className="form-control" id="name" name="name" onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Name" />
              <label htmlFor="name">Name</label>
              {formik.touched.name && formik.errors.name && (
                <div className="text-danger">{formik.errors.name}</div>
              )}
            </div>
          </div>
          <div className="col-6">
            <div className="form-floating">
              <input type="email" className="form-control" id="email" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Email" />
              <label htmlFor="email">Email</label>
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger">{formik.errors.email}</div>
              )}
            </div>
          </div>
          {/* <div className="col-12">
            <div className="form-floating">
              <input type="text" className="form-control" id="phone" name="phone" onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Phone Number" />
              <label htmlFor="phone">Phone Number</label>
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-danger">{formik.errors.phone}</div>
              )}
            </div>
          </div> */}
          <div className="col-12">
            <div className="form-floating">
              <textarea
                className="form-control"
                id="message"
                name="message"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Message"
              />
              <label htmlFor="message">Message</label>
              {formik.touched.message && formik.errors.message && (
                <div className="text-danger">{formik.errors.message}</div>
              )}
            </div>
          </div>

          <div className="login-btn">
            <button type="submit" className="btn col-12 mt-2 mb-2">
              Send
            </button>
          </div>
          <div className="col-12">
            <div className="row text-login">
              <div className="col-md-6">
                <Link to='/'>Back</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
