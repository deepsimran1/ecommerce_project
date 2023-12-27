import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DisplayAbout() {
  const [aboutContent, setAboutContent] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/getcontent?type=2");
        setAboutContent(response.data.Content.description||"");
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    };

    fetchAbout();
  }, []);

  return (
    <div className='container'>
      <div>
        {aboutContent ? (
          <>
          <h2 className='text-center'>About Us</h2>
            <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
