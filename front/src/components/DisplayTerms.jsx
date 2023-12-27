import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DisplayTerms() {
  const [termsContent, setTermsContent] = useState('');

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

  return (
    <div className='container'>
      <div>
        {termsContent ? (
          <>
          <h2 className='text-center'>Terms & Conditions</h2>
            <div dangerouslySetInnerHTML={{ __html: termsContent }} />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
