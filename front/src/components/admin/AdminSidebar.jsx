import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
export default function AdminSidebar() {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();
  const handleSetting = () => {
    navigate("/admin/profile", { state: { edit: true } });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/admin");
  };
  const handleToggle = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };
  return (
    <>
      <div className="flex-shrink-0 p-3 bg-light col-2">
        <ul className="list-unstyled ps-0 border-top">
          <li className="mb-1 mt-4">
            <button onClick={() => handleToggle("customer")} className="btn">
              Customers
            </button>
            {activeSection === "customer" && (
              <div>
                <ul className="list-unstyled fw-normal pb-1 small">
                  <li>
                    <Link to="/admin/customers" className="link-dark rounded">
                      View Customers
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/addCustomer" className="link-dark rounded">
                      Add Customer
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li className="mb-1">
            <button
              className="btn btn-toggle align-items-center rounded collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#product-collapse"
              aria-expanded="false"
            >
              Products
            </button>
            <div className="collapse" id="product-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <li>
                  <Link to="/admin/products" className="link-dark rounded">
                    View Products
                  </Link>
                </li>
                <li>
                  <Link to="/admin/addproduct" className="link-dark rounded">
                    Add Products
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li className="mb-1">
            <button
              className="btn btn-toggle align-items-center rounded collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#content-collapse"
              aria-expanded="false"
            >
              Content
            </button>
            <div className="collapse" id="content-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <li>
                  <Link to="/admin/policy" className="link-dark rounded">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/termsConditions"
                    className="link-dark rounded"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/admin/aboutus" className="link-dark rounded">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/admin/contactUser" className="link-dark rounded">
                    Contact Users
                  </Link>
                </li>
                
              </ul>
            </div>
          </li>
          <li className="mb-1">
            <button
              className="btn btn-toggle align-items-center rounded collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#blog-collapse"
              aria-expanded="false"
            >
              Blog
            </button>
            <div className="collapse" id="blog-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                  <Link to="/admin/createBlog" className="link-dark rounded">
                    Create Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/admin/adminBlogs" className="link-dark rounded">
                    Your Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/admin/allBlogs" className="link-dark rounded">
                    All Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/admin/editBlog" className="link-dark rounded">
                    Edit Blog
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li className="border-top my-3"></li>
          <li className="mb-1">
            <button
              className="btn btn-toggle align-items-center rounded collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#account-collapse"
              aria-expanded="false"
            >
              Account
            </button>
            <div className="collapse" id="account-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <li>
                  <Link to="/admin/profile" className="link-dark rounded">
                    Profile
                  </Link>
                </li>

                <li>
                  <a className="link-dark rounded" onClick={handleSetting}>
                    Settings
                  </a>
                </li>
                <li>
                  <a className="link-dark rounded" onClick={handleLogout}>
                    Log out
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

{
  /* <>
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-light side col-2">
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <span className="fs-4">Sidebar</span>
        </a>
        <hr />
        <ul className="nav nav-pills  flex-column mb-auto">
          <li className="nav-item">
            <a href="/admin/home" className="nav-link active" aria-current="page">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="nav-link link-dark">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/admin/addproduct" className="nav-link link-dark">
              Add product
            </a>
          </li>
          <li>
            <a href="/admin/products" className="nav-link link-dark">
              Products
            </a>
          </li>
          <li className='nav nav-list'>
            <button
              className="nav-link link-dark accordian-heading nav-header-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#customers-collapse"
              aria-expanded="false"
            >
              Customers<b className="caret"></b>
            </button>
            <div className="collapse nav nav-list" id="customers-collapse">
              <ul className="list-unstyled fw-normal pb-1">
                <li>
                  <a href="/admin/customers" title="title">View Customers</a>
                </li>
                <li>
                  <Link to="/admin/addCustomer" className="d-inline-flex align-items-center rounded">
                    Add Customer
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <hr />
      </div>
    </> */
}
