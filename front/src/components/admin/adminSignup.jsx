import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";

export default function AdminSignup() {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Use FormData to handle file uploads
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("image", values.image);

        const response = await axios.post(
          "http://localhost:4000/users/adminSignup",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Form values", values);

        if (response.status === 201 && response.data.otpSent) {
          console.log("OTP sent success");
          alert("Otp sent successfully");
          setOtpSent(true);
        }

        alert("Save");
        navigate("/admin/verifyEmail", { state: { email: values.email } });
        formik.resetForm();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert("User already exists");
        } else {
          console.error("Error:", error);
        }
      }
    },
  });

  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  if (otpSent) {
    return <VerifyEmail />;
  }

  return (
    <>
      <div className="container p-5">
        <form className="row g-3" onSubmit={formik.handleSubmit}>
          <div className="col-md-12">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="enter your name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-danger">{formik.errors.name}</div>
            )}
          </div>
          <div className="col-md-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="example@gmail.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger">{formik.errors.password}</div>
            )}
            <div className="col-md-12">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={(event) =>
                  formik.setFieldValue("image", event.currentTarget.files[0])
                }
                onBlur={formik.handleBlur}
              />
              {formik.touched.image && formik.errors.image && (
                <div className="text-danger">{formik.errors.image}</div>
              )}
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
