import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import AdminSidebar from "./AdminSidebar";
import { useLocation } from "react-router-dom";

const AdminProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    mobile: "",
    image:"",
  });

  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uniqueVersionString, setUniqueVersionString] = useState(Date.now());

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/users/adminProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setEditedData(response.data);
        setPageTitle(response.data.name);
      })
      .catch((error) => console.error("Error fetching admin details:", error));
    if (location.state && location.state.edit) {
      setEditMode(true);
    }
  }, [location.state]);

  useEffect(() => {
    // Set imageUrl when the image property changes
    if (editedData.image) {
      setImageUrl(`http://localhost:4000/${editedData.image}`);
    } else {
      console.log("editedData.image is undefined or falsy", editedData.image);
    }
  }, [editedData.image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevAdmin) => ({ ...prevAdmin, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", editedData.name);
    formData.append("email", editedData.email);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    axios
      .put(`http://localhost:4000/users/editAdmin`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        console.log("admin updated successfully");
        setEditMode(false);
        navigate("/admin/profile");
        // Update the version string to force a reload of the image
        setUniqueVersionString(Date.now());
      })
      .catch((error) => console.error("Error updating admin:", error));
  };

  const handleCancel = () => {
    setEditMode(false);
    setImageUrl(`http://localhost:4000/${editedData.image}`);
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  function setPageTitle(pageName){
    document.title= `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}'s Profile`;
  }

  return (
    <>
      <div className="bg-light">
        <AdminNav />
        <div className="contain row container-fluid">
          <AdminSidebar />
          <div className="card main col-9 bg-white con rounded shadow p-4 mb-5 pb-5">
            <h2>Profile</h2>
            {editMode ? (
              <form>
                <div className="mb-3">
                  {editedData.image && (
                    <img
                      src={imageUrl}
                      alt="admin-img"
                      className="admin-p-img mt-2"
                      style={{ maxWidth: "200px" }}
                    />
                  )}
                  <br />
                  <div className="col-3 mt-1">
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={editedData.name}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="name" className="text-muted">
                      Name
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      value={editedData.email}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="email" className="text-muted">
                      Email*
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="mobile"
                      value={editedData.mobile}
                      placeholder="Mobile Number"
                      onChange={(e) => handleChange(e, "mobile")}
                    />
                    <label htmlFor="name" className="text-muted">
                      Mobile Number
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                {editedData.image && (
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                      Image
                    </label>
                    <div>
                      <img
                        src={imageUrl}
                        alt="admin-img"
                        key={editedData.image} // Add a unique key to force component re-render
                        className="admin-p-img"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <div>{editedData.name}</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Email
                  </label>
                  <div>{editedData.email}</div>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
