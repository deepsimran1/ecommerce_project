import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button } from 'react-bootstrap';
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    // function setPageTitle(pageName){
    //   document.title= `${pageName}`;
    // }
    // setPageTitle('Customers');

    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:4000/users/getUsers',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem('token');
    axios
    .delete(`http://localhost:4000/users/deleteUser/${userId}`,{
      headers:{
        Authorization:`Bearer ${token}`,
      }
    })
      .then(() => {
        console.log("User deleted successfully");
        window.location.reload();
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
      })
      .catch((error) =>
        console.error("Error deleting user:", error)
      );
  };
  

  
  if (showModal ) {
    
    document.title = `Customers - ${selectedUser?.name.charAt(0).toUpperCase() + selectedUser.name.slice(1)} `;
  } else {
    document.title = 'Customers';
  }

  return (
    <>
      <div className='bg-light'>
        <AdminNav />
        <div className='conatin row container-fluid'>
          <AdminSidebar />
          <div className="card main col-9 bg-white con rounded shadow p-4 mb-5 pb-5">
            <h2>Customers</h2>
            <Table hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Verified</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name.charAt(0).toUpperCase()+user.name.slice(1)}</td>
                    <td>{user.email}</td>
                    <td>{user.verified ? 'Yes' : 'No'}</td>
                    <td>
                      <button
                        className="btn btn-success ms-2 mb-2"
                        onClick={() => handleViewDetails(user)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="btn btn-primary ms-2 mb-2 edit change-color" >
                        <Link to={`/admin/editCustomer/${user._id}`}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                      </button>
                      <button className="btn btn-danger ms-2 mb-2" onClick={()=>handleDeleteUser(user._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>


            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedUser && (
                  <div>
                    <p>Name: {selectedUser.name.charAt(0).toUpperCase() + selectedUser.name.slice(1)}</p>
                    {selectedUser.mobile && <p>Mobile: {selectedUser.mobile}</p>}
                    <p>Email: {selectedUser.email}</p>
                    {selectedUser.dob && <p>DOB: {selectedUser.dob}</p>}
                  {selectedUser.alternativeMob && (
                    <p>Alternative Mobile Number: {String(selectedUser.alternativeMob)}</p>
                  )}
                    <p>Verified: {selectedUser.verified ? 'Yes' : 'No'}</p>
                    {selectedUser.otp && <p>OTP: {selectedUser.otp}</p>}
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;


