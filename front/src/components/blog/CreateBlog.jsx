// src/App.js
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AdminNav from "../admin/AdminNav";
import AdminSidebar from "../admin/AdminSidebar";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const BlogForm = () => {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Create a Blog');
  })
  const [title, setTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setBlogContent(data);
  };


  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", blogContent);
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:4000/users/createBlog",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Blog added");
        navigate("/admin/adminBlogs");
      } else {
        alert("Error adding Blog");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding Blog");
    }
  };


  return (
    <div>
      <h3 className="mb-4">Create Blog</h3>
      <form onSubmit={handleSubmit}>
        <div className=" mb-3">
        <label className="text-muted" htmlFor="title">Title:</label>
          <input
          className="form-control"
          id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
           
        </div>
        <div className="mb-3">
        <label className="text-muted mb-1">Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
         
        </div>
        <div>
          <label className="text-muted mb-1">Blog Content:</label>
          <CKEditor
            editor={ClassicEditor}
            data={blogContent}
            onChange={handleEditorChange}
           
          />
        </div>
        <div className="text-end">
          <button type="submit" className="btn mt-3 btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

function CreateBlog() {
  return (
    <div className="bg-light">
      <AdminNav />
      <div className="contain">
        <AdminSidebar />
        <div className="main ">
          <div className="container d-flex justify-content-center align-items-center">
          <div className=" col-lg-12 card shadow p-4">
            <BlogForm />
          </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
