import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button } from 'react-bootstrap';
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTrash, faEye } from "@fortawesome/free-solid-svg-icons";


const ContactUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:4000/users/getContactUsers',{
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
    .delete(`http://localhost:4000/users/deleteContactUser/${userId}`,{
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
  
  return (
    <>
      <div className='bg-light'>
        <AdminNav />
        <div className='conatin row container-fluid'>
          <AdminSidebar />
          <div className="card main col-9 bg-white con rounded shadow p-4 mb-5 pb-5">
            <h2>Contact Users</h2>
            <Table hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    
                    <td>
                      <button
                        className="btn btn-success ms-2 mb-2"
                        onClick={() => handleViewDetails(user)}
                      >
                        <FontAwesomeIcon icon={faEye} />
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
                    <p>Name: {selectedUser.name}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>Message: {selectedUser.message}</p>
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

export default ContactUser;


