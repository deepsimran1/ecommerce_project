import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DisplayPolicy() {
  const [policyContent, setPolicyContent] = useState('');

  useEffect(() => {
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Privacy Policy');

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

  return (
    <div className='container'>
      <div>
        {policyContent ? (
          <>
          <h2 className='text-center'>Privacy Policy</h2>
            <div dangerouslySetInnerHTML={{ __html: policyContent }} />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
