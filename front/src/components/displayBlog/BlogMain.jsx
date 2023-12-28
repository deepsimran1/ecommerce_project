import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './blog.css';
import { Link } from 'react-router-dom';
export default function BlogMain() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {

    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Blog');

    // Fetch blogs when the component mounts
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users/getAllBlogs'); // Assuming your API endpoint is '/api/blogs'
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className='bg-color pt-5 blog-page'>
      <div className='container '>
      <div className='row d-flex align-items-center justify-content-center'>
        {blogs.map((blog) => (
          <div className='col-sm-6 blogs mb-3 p-3' key={blog._id}>
           <Link to={`/blogs/${blog._id}`} className='link'>
           <div className='card card-bor blog-div'>
              <div className='blog-img'>
                <img src={`http://localhost:4000/${blog.image}`} alt={blog.title} />
              </div>
              <div className='blog-details p-4'>
              <label className='date pb-2 pt-1'>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </label>           
                       <h4>{blog.title}</h4>
                {/* <p>{blog.contentText}</p> */}
                {/* You can add more details or buttons as needed */}
              </div>
            </div>
           </Link>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
