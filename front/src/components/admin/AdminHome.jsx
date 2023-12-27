import React, { useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
import AdminNav from "./AdminNav";
import AdminSidebar from "./AdminSidebar";
import UserGraph from "./UserGraph";
import ProductGraph from "./ProductGraph";
import axios from "axios";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import './admin.css';
const AdminHome = () => {
  const [adminName, setAdminName] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first. Page not available.");
          navigate('/admin');
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/users/adminProfile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseTotalProducts = await axios.get(
          "http://localhost:4000/users/getTotalProducts"
        );

        const totalProducts = responseTotalProducts.data.totalProducts;
        setTotalProducts(totalProducts);

        const responseTotalUsers = await axios.get(
          "http://localhost:4000/users/getTotalUsers"
        );

        const totalUsers = responseTotalUsers.data.totalUsers;
        setTotalUsers(totalUsers);

        const adminData = response.data;
        if (adminData && adminData.name) {
          setAdminName(adminData.name);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    fetchAdminProfile();
  }, []);
  return (
    <div className="bg-light">
      <AdminNav />

      <div className="contain ">
        <AdminSidebar />
        <div className="main container mt-0">
          <div className="row d-flex justify-content-center align-items-center mt-0">
            <div className="col-lg-4 col-md-12  col-sm-12 p-2 mb-4 ">
              <div className="card shadow p-3 ">
              <h4 className="tesh">Welcome, {adminName}</h4>
              <p>All systems are running smoothly! </p>
              <button className="btn btn-info text-white m-1 col-5">View Sales</button>
              </div>
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12  mb-4 ">
              <div className="card shadow p-3">
              <h4>Statistics Card</h4>
              <p>Total 48.5% growth 😎 this month</p>
              <div className="row">
                <div className=" row col-6">
                  <div className="col-lg-3 col-sm-6 ">
                    <div className="customer-icon-color fs-4 shadow ">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12 ">Customers</div>
                      <div col-12>{totalUsers}</div>
                    </div>
                  </div>
                </div>
                <div className=" row col-6">
                  <div className="col-3 ">
                    <div className="product-icon-color fs-4 shadow ">
                      <FontAwesomeIcon icon={faBox} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12 ">Products</div>
                      <div className="col-12">{totalProducts}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
          </div>
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-lg-6 col-md-12 col-sm-12 mt-1 mb-4">
              <UserGraph />
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 mt-1 mb-4">
              <ProductGraph />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
