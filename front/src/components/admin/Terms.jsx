import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TermsForm = () => {
  const [termsContent, setTermsContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/getcontent?type=1");
        setTermsContent(response.data.Content.description||"");
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    };

    fetchTerms();
  }, []);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setTermsContent(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/users/addContent", {
        type:1,
        description: termsContent
      });

      if (response.status === 201 || response.status === 200) {
        alert("terms added/updated");
        navigate('/admin/home');
      } else {
        alert("Error adding terms/updating terms");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error adding terms/updating terms");
    }
  };

  return (
    <div>
      <h3 className='mb-4'>Terms</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Terms Content:</label>
          <CKEditor
            editor={ClassicEditor}
            data={termsContent}
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

function Terms() {
  return (
    <div className='bg-light'>
      <AdminNav />
      <div className='contain'>
        <AdminSidebar />
        <div className='main container d-flex justify-content-center align-items-center'>
          <div className='card shadow p-4'>
            <TermsForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;
