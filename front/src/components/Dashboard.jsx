import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css'; // Import your custom CSS file
import { useParams } from 'react-router-dom';

export default function Dashboard() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [editedData, setEditedData] = useState({ name: '', email: '',mobile:'',dob:'',alternativeMob:'' });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:4000/users/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
            const { name, email, mobile, dob, alternativeMob } = response.data;
            setUserData({ name, email });
            setEditedData({ name, email, mobile: mobile || '', dob: dob || '', alternativeMob: alternativeMob || '' });
            setPageTitle(name);
        } else {
          console.error('Error fetching user data');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function setPageTitle(pageName){
    document.title= `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
  }
  

  useEffect(() => {
   
    fetchUserData();
  }, []);

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        
        const response = await axios.put(
          `http://localhost:4000/users/user`,
          editedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUserData((prevUserData) => ({
            ...prevUserData,
            ...response.data,
          }));
          alert("Data saved successfully 😁")
        } else {
          console.error(`Error updating user data`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="container">
        {/* <h4>Account</h4>
        <p>{userData.name}</p> */}
        <div className="dashboard-content">
          <div className="user-information">
            <h4>Edit Details</h4>
            <hr className="border-top my-3"></hr>
            <div className='col-12 mt-3 mb-3'>
            <div className='form-floating'>
              <input
                type="text"
                className='form-control'
                id='name'
                placeholder='name'
                value={editedData.name}
                onChange={(e) => handleChange(e, 'name')}
              />
              <label htmlFor="name">Name</label>
            </div>
            </div>
            <div className='col-12 mt-3 mb-3'>
            <div className='form-floating'>
              <input
                type="text"
                className='form-control'
                id='mobile'
                value={editedData.mobile}
                placeholder='Mobile Number'
                onChange={(e) => handleChange(e, 'mobile')}
              />
              <label htmlFor="name" className='text-muted'>Mobile Number</label>
            </div>
            </div>
            <div className='col-12 mt-3 mb-3'>
            <div className='form-floating'>
              <input
                type="text"
                className='form-control'
                id='email'
                placeholder='email'
                value={editedData.email}
                onChange={(e) => handleChange(e, 'email')}
              />
              <label htmlFor="email">Email*</label>
            </div>
            </div>
            <div className='col-12 mt-3 mb-3'>
              <div className='form-floating'>
                <input
                  type="date"
                  className='form-control'
                  id='dob'
                  placeholder='Date of Birth'
                  value={editedData.dob? new Date(editedData.dob).toISOString().split('T')[0]:""}
                  onChange={(e) => handleChange(e, 'dob')}
                />
                <label htmlFor="dob" className='text-muted'>Date of Birth</label>
              </div>
            </div>
            
            <h6 className='mt-4'>Alternative Mobile Details</h6>
            <hr className="border-top my-3"></hr>
            <div className='col-12 mt-3 mb-3'>
              <div className='form-floating'>
                <input
                  type="text"
                  className='form-control'
                  id='alternativeMob'
                  placeholder='Alternative Mobile'
                  value={editedData.alternativeMob}
                  onChange={(e) => handleChange(e, 'alternativeMob')}
                />
                <label htmlFor="alternativeMob" className='text-muted'>Alternative Mobile</label>
              </div>
            </div>
            <button onClick={handleSave} className='btn btn-secondary col-12 mt-4 mb-4 btn-save'>Save</button>
          </div>
        </div>
      </div>
    </>
  );
}
