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
                    <Link to="/admin/customers" className="link-dark rounded ms-4">
                      View Customers
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/addCustomer" className="link-dark rounded ms-4">
                      Add Customer
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li className="mb-1">
            <button
              className="btn "
              onClick={()=> handleToggle('product')}>
              Products
            </button>
            {activeSection === "product" && (
              <div>
              <ul className=" list-unstyled fw-normal pb-1 small">
                <li>
                  <Link to="/admin/products" className="link-dark rounded ms-4">
                    View Products
                  </Link>
                </li>
                <li>
                  <Link to="/admin/addproduct" className="link-dark rounded ms-4">
                    Add Products
                  </Link>
                </li>
              </ul>
            </div>
            )}
            
          </li>
          <li className="mb-1">
            <button
            onClick={()=>handleToggle("content")}
              className="btn"
            >
                Content
            </button>
              {activeSection === "content" && (
                 <div>
                 <ul className="list-unstyled fw-normal pb-1 small">
                   <li>
                     <Link to="/admin/policy" className="link-dark rounded ms-4">
                       Privacy Policy
                     </Link>
                   </li>
                   <li>
                     <Link
                       to="/admin/termsConditions"
                       className="link-dark rounded ms-4"
                     >
                       Terms & Conditions
                     </Link>
                   </li>
                   <li>
                     <Link to="/admin/aboutus" className="link-dark rounded ms-4">
                       About Us
                     </Link>
                   </li>
                   <li>
                     <Link to="/admin/contactUser" className="link-dark rounded ms-4">
                       Contact Users
                     </Link>
                   </li>
                   
                 </ul>
               </div>
              )}
            
           
          </li>
          <li className="mb-1">
            <button
            onClick={()=>handleToggle('blog')}
              className="btn "
            >
              Blog
            </button>
            {activeSection === "blog" && (
              <div>
              <ul className=" list-unstyled fw-normal pb-1 small">
              <li>
                  <Link to="/admin/createBlog" className="link-dark rounded ms-4">
                    Create Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/admin/adminBlogs" className="link-dark rounded ms-4">
                    Your Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/admin/allBlogs" className="link-dark rounded ms-4">
                    All Blogs
                  </Link>
                </li>
              </ul>
            </div>
            )}
            
          </li>
          <li className="border-top my-3"></li>
          <li className="mb-1">
            <button
            onClick={()=>handleToggle('account')}
              className="btn "
            >
              Account
            </button>
            {activeSection === "account" && (
 <div>
 <ul className=" list-unstyled fw-normal pb-1 small">
   <li>
     <Link to="/admin/profile" className="link-dark rounded ms-4">
       Profile
     </Link>
   </li>

   <li>
     <a className="link-dark rounded ms-4" onClick={handleSetting}>
       Settings
     </a>
   </li>
   <li>
     <a className="link-dark rounded ms-4" onClick={handleLogout}>
       Log out
     </a>
   </li>
 </ul>
</div>
            )}
           
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
