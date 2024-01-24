import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AboutUsForm = () => {
  const [aboutContent, setAboutContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Add About Us');
    const fetchAboutUs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/getcontent?type=2");
        setAboutContent(response.data.Content.description||"");
      } catch (error) {
        console.error('Error fetching about:', error);
      }
    };

    fetchAboutUs();
  }, []);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setAboutContent(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/users/addContent", {
        type:2,
        description: aboutContent
      });

      if (response.status === 201 || response.status === 200) {
        alert("About added/updated");
        navigate('/admin/home');
      } else {
        alert("Error adding about/updating about");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error adding about/updating about");
    }
  };

  return (
    <div>
      <h3 className='mb-4'>About Us</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>About Content:</label>
          <CKEditor
            editor={ClassicEditor}
            data={aboutContent}
            onChange={handleEditorChange}
          />
        </div>
        <div>
          <button type="submit" className='btn mt-3 btn-primary'>Submit</button>
        </div>
      </form>
    </div>
  );
};

function AboutUs() {
  return (
    <div className='bg-light'>
      <AdminNav />
      <div className='contain'>
        <AdminSidebar />
        <div className='main container d-flex justify-content-center align-items-center'>
          <div className='card shadow p-4'>
            <AboutUsForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
