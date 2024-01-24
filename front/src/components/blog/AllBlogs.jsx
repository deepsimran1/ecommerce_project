import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from 'react-bootstrap'; 
import AdminNav from "../admin/AdminNav";
import AdminSidebar from "../admin/AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye} from "@fortawesome/free-solid-svg-icons";

const AllBlogs = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/users/getAllBlogs"
        );
        setAllBlogs(response.data);
      } catch (error) {
        console.error("Error fetching all blogs", error);
      }
    };

    fetchAllBlogs();
  }, []);

  const handleCloseModal = () => {
    setSelectedBlog(null);
    setShowModal(false);
  };

  const handleOpenModal = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
    console.log(blog);
  };

      
  if (showModal ) {
    
    document.title = `All Blogs - ${selectedBlog.title} `;
  } else {
    document.title = 'All Blogs';
  }


  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/users/deleteBlogWithoutAdminId/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setAllBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
        alert("Blog Deleted Successfully");
      }
    } catch (error) {
      console.error('Error deleting blog', error);
    }
  };

  return (
    <div className="bg-light">
      <AdminNav />
      <div className="contain row container-fluid">
        <AdminSidebar />
        <div className="main container d-flex justify-content-center align-items-center">
          <div className="card shadow p-4 col-11 me-3">
            <h2>All Blogs</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Created At</th>
                  <th>Status</th>
                  {/* Add more columns as needed */}
                </tr>
              </thead>
              <tbody>
                {allBlogs.map((blog, index) => (
                  <tr key={blog._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`http://localhost:4000/${blog.image}`}
                        alt={blog.title}
                        style={{ width: "200px", height: "90px" }}
                      />
                    </td>
                    <td>{blog.title}</td>
                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-success ms-2 mb-2"
                        onClick={() => handleOpenModal(blog)}
                      >
                        <FontAwesomeIcon icon={faEye} />
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

      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>Blog Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
    
          {selectedBlog ? (
    <>
      <h5>{selectedBlog.title}</h5>
    <img src={`http://localhost:4000/${selectedBlog.image}`} alt={selectedBlog.title} className="img-fluid"/>

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

export default AllBlogs;
