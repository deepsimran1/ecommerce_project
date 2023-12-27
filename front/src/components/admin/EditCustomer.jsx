import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';

const EditCustomer = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    verified: '',
    mobile: '',
    dob: '',
    alternativeMob: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:4000/users/getUserById/${userId}`)
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching user details:', error));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:4000/users/updateUserByAdmin/${userId}`, user, {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })
      .then(() => {
        console.log('User updated successfully');
        navigate('/admin/customers');
      })
      .catch(error => console.error('Error updating user:', error));
  };

  return (
    <>
      <div className='bg-light'>
        <AdminNav />
        <div className='contain row container-fluid'>
          <AdminSidebar />
          <div className="card main col-9 bg-white con rounded shadow p-4 mb-5 pb-5">
            <h2>Edit Customer</h2>
            <form>
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                />
                <label htmlFor="name">Name</label>
              </div>
              <div className="mb-3 form-floating">
                <textarea
                  className="form-control"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                ></textarea>
                <label htmlFor="email">Email</label>
              </div>
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="verified"
                  name="verified"
                  value={user.verified}
                  onChange={handleInputChange}
                />
                <label htmlFor="verified">Verified</label>
              </div>

              {user.mobile !== undefined && (
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="mobile"
                    name="mobile"
                    value={user.mobile}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="mobile">Mobile</label>
                </div>
              )}
              {user.dob !== undefined && (
                <div className="mb-3 form-floating">
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    name="dob"
                    value={user.dob? new Date(user.dob).toISOString().split('T')[0]:""}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="dob">Date of Birth</label>
                </div>
              )}
              {user.alternativeMob !== undefined && (
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="alternativeMob"
                    name="alternativeMob"
                    value={user.alternativeMob}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="alternativeMob">Alternative Mobile</label>
                </div>
              )}

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

export default EditCustomer;
