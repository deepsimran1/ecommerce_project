import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import AdminNav from '../admin/AdminNav';
import AdminSidebar from '../admin/AdminSidebar';

const EditBlog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/users/getBlog/${blogId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setBlog(response.data);
        setTitle(response.data.title);
        setContent(response.data.contentText);
      } catch (error) {
        console.error('Error fetching blog', error);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleUpdateBlog = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/users/updateBlog/${blogId}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Blog updated successfully');
        navigate('/admin/adminBlogs')
      }
    } catch (error) {
      console.error('Error updating blog', error);
    }
  };

  return (
    <div className='bg-light'>
      <AdminNav/>
      <div className='contain row container-fluid'>
        <AdminSidebar/>
        <div className='main container d-flex justify-content-center align-items-center'>
          <div className='card shadow p-4 col-11 me-3'>
          <h2>Edit Blog</h2>
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onChange={(event, editor) => setContent(editor.getData())}
      />
      <button onClick={handleUpdateBlog} className='btn btn-primary m-2 col-2'>Save</button>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default EditBlog;
