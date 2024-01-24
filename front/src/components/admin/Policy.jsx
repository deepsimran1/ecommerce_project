import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PolicyForm = () => {
  const [policyContent, setPolicyContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      function setPageTitle(pageName){
        document.title= `${pageName}`;
      }
      setPageTitle('Add Privacy Policy');
    const fetchPolicy = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/getcontent?type=0");
        setPolicyContent(response.data.Content.description||"");
      } catch (error) {
        console.error('Error fetching policy:', error);
      }
    };

    fetchPolicy();
  }, []);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setPolicyContent(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/users/addContent", {
        type:0,
        description: policyContent
      });

      if (response.status === 201 || response.status === 200) {
        alert("Policy added/updated");
        navigate('/admin/home');
      } else {
        alert("Error adding policy/updating policy");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error adding policy/updating policy");
    }
  };

  return (
    <div>
      <h3 className='mb-4'>Privacy Policy</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Policy Content:</label>
          <CKEditor
            editor={ClassicEditor}
            data={policyContent}
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

function Policy() {
  return (
    <div className='bg-light'>
      <AdminNav />
      <div className='contain'>
        <AdminSidebar />
        <div className='main container d-flex justify-content-center align-items-center'>
          <div className='card shadow p-4'>
            <PolicyForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Policy;
