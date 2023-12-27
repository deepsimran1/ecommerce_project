import React, { useState, } from 'react';
import axios from 'axios';
import { Link, useNavigate, } from 'react-router-dom';  // Import useParams
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';


const AddCustomer = () => {
 const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    verified:''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.post(
      "http://localhost:4000/users/addCustomer",
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Correct the syntax here
        },
      }
    )
    .then(() => {
      console.log('User added successfully');
      navigate('/admin/customers');
    })
    .catch(error => console.error('Error updating user:', error));
  };
  

  return (
    <>
    <div className='bg-light'>
        <AdminNav/>
        <div className='contain row container-fluid'>
            <AdminSidebar/>
            <div className="card main col-9 bg-white con rounded shadow p-4 mb-5 pb-5">
            <h2>Add User</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <textarea
            className="form-control"
            id="email"
            name="email"
            onChange={handleInputChange}
          ></textarea>
        </div>
    

        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="btn btn-secondary change-color ms-2">
          <Link to={'/admin/customers'}>
            Cancel
          </Link>
        </button>
      </form>
            </div>
        </div>
    </div>
    
    </>
  );
};

export default AddCustomer;
