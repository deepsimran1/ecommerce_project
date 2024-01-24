import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; 
import axios from 'axios';
import AdminNav from '../admin/AdminNav';
import AdminSidebar from '../admin/AdminSidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye,faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const AdminBlogs = () => {
  const [adminBlogs, setAdminBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
const navigate = useNavigate();

  const token = localStorage.getItem('token');
  useEffect(() => {
   
    const fetchAdminBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users/getAdminBlogs',{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        setAdminBlogs(response.data);
      } catch (error) {
        console.error('Error fetching admin blogs', error);
      }
    };

    fetchAdminBlogs();
  }, []);

  if (showModal ) {
    
    document.title = `Your Blogs - ${selectedBlog.title} `;
  } else {
    document.title = 'Your Blogs';
  }

  const handleCloseModal = () => {
    setSelectedBlog(null);
    setShowModal(false);
  };

  const handleOpenModal = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
    console.log(blog);
  };


  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/users/deleteBlog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAdminBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
        alert("Blog Deleted Successfully");
      }
    } catch (error) {
      console.error('Error deleting blog', error);
    }
  };

  const handleEditBlog = (blogId) => {
    // Navigate to the EditBlog component with the blogId
    navigate(`/admin/editBlog/${blogId}`);
  };


  return (
    <div className='bg-light'>
      <AdminNav/>
      <div className='contain row container-fluid'>
        <AdminSidebar/>
        <div className='main container d-flex justify-content-center align-items-center'>
          <div className='card shadow p-4 col-11 me-3'>
          <h2>Your Blogs</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>S.No</th>
            <th className='col-lg-7'>Title</th>
            <th>Created At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {adminBlogs.map((blog,index) => (
            <tr key={blog._id}>
              <td>{index+1}</td>
              <td>{blog.title}</td>
              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td>
                      <button
                        className="btn btn-success ms-2 mb-2"
                        onClick={() => handleOpenModal(blog)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="btn btn-primary ms-2 mb-2"
                        onClick={() => handleEditBlog(blog._id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn btn-danger ms-2 mb-2" 
                        onClick={() => handleDeleteBlog(blog._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>Blog Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
    
          {selectedBlog ? (
    <>
      <h5>{selectedBlog.title}</h5>
    <img src={`http://localhost:4000/${selectedBlog.image}`} alt={selectedBlog.title} className='img-fluid'/>

      <p dangerouslySetInnerHTML={{ __html: selectedBlog.contentText }} />
    </>
  ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default AdminBlogs;
