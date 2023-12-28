import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashCan, faSave} from "@fortawesome/free-regular-svg-icons";
import { faTimes} from "@fortawesome/free-solid-svg-icons";

export default function BlogDetails() {
  const [blogDetails, setBlogDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const { blogId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  
  const token = localStorage.getItem("token");


  useEffect(() => {
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    };
    

    const fetchLoggedInUser = async() =>{
      try{
        const response = await axios.get('http://localhost:4000/users/getLoggedInUser',{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        });
        setLoggedInUser(response.data);
      }catch(error){
        console.error("Error fetching logged in user",error);
      }
    };
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/users/getBlogDetails/${blogId}`);
        console.log('API Response:', response);
        setBlogDetails(response.data);
        setPageTitle(response.data.title);
      } catch (error) {
        console.error('Error fetching blog details', error);
      }
    };
    const fetchComments = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/users/getComments/${blogId}`);
          console.log('Comments:', response.data);
          setComments(response.data);
        } catch (error) {
          console.error('Error fetching comments', error);
        }
      };
  
      fetchLoggedInUser();
    fetchBlogDetails();
    fetchComments();
  }, [blogId,comment,token]);

  const handleCommentSubmit = async () => {
    try {
      await axios.post('http://localhost:4000/users/addComment', {
        blogId,
        content: comment,
      },{
        headers:{
            Authorization:`Bearer ${token}`,
        }
      });
      alert('Comment added successfully');  
      setComment('');
      
    } catch (error) {
      console.error('Error submitting comment', error);
    }
  };


  if (!blogDetails) {
    return <div>Loading...</div>;
  }


  const formatDateDistanceToNow = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };


  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/users/like/${blogId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Blog liked successfully');
      const updatedLikes = response.data.likes !== undefined ? response.data.likes : response.data.likeCount;
      setBlogDetails(prevDetails => ({ ...prevDetails, likeCount:updatedLikes }));
      setIsLiked(true);
      // You can update the state to show the new number of likes if needed
    } catch (error) {
      console.error('Error liking blog', error);
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingComment(commentId);
    setEditedCommentContent(currentContent);
  };

  const handleSaveComment = async (commentId) => {
    try {
      await axios.put(
        `http://localhost:4000/users/editComment/${commentId}`,
        {
          content: editedCommentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Comment edited successfully');
      setComments((prevComments) =>
        prevComments.map((prevComment) =>
          prevComment._id === commentId
            ? { ...prevComment, content: editedCommentContent }
            : prevComment
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error('Error editing comment', error);
    }
  };
 
  const handleDeleteComment = async(commentId)=>{
    try{
      await axios.delete(`http://localhost:4000/users/deleteComment/${commentId}`,{
        headers:{
          Authorization:`Bearer ${token}`,
        }
      });
      alert('Comment deleted successfully');
      setComments((prevComments)=>prevComments.filter((prevComment)=>prevComment._id !== commentId));
    }catch(error){
      console.error("Error deleting comment",error);
    }
  }
  
  return (
    <>

<div className='blog-page'>
<div className='card-img-overlay-container'>
<img className="card-img-top blog-im" src={`http://localhost:4000/${blogDetails.image}`} alt={blogDetails.title} />
<div className='overlay'></div>
    </div>
    <div className="container mt-4">
      <div className="card card-bor blog-details-card">
        <div className="card-body">
          <h2 className="card-title title">{blogDetails.title}</h2>
          <label className='pb-2 pt-1 date-blog mb-3'>
                    {new Date(blogDetails.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </label>   
          <div dangerouslySetInnerHTML={{ __html: blogDetails.contentText }} />
        </div>
      </div>

      <div className='mt-4'>
        <h4 className='tesh'>Comments</h4>
        <h5 className='text-center'>What do you think?</h5>
        <div className='text-center like'>
        <FontAwesomeIcon icon={faThumbsUp} className={`ml-2 ${isLiked? 'text-primary':''}`} onClick={handleLike} />   
        {blogDetails.likeCount}     
        </div>
          <br/>
          <div className='col-12'>
            <div className='form-floating'>
              <textarea 
              className='form-control comment'
              name="comment"
              type='text'
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              placeholder='Type a comment'
              />
              <label htmlFor="comment">Comment It!</label>
            </div>
          </div>
        <div className='text-end mb-4'>
        <button 
        className='btn btn-success'
        onClick={handleCommentSubmit}
        >Submit</button>
        </div>
       
        <div>
        {comments.map((comment) => (
          <div key={comment._id}>
            <div>
              <div className='d-flex justify-content-between '>
                <div className='m-0 name'>
                  {comment.userId.name.charAt(0).toUpperCase() + comment.userId.name.slice(1)}
                </div>
                {loggedInUser && comment.userId._id === loggedInUser._id && (
                  <div className='text-end comment-icons'>
                    {editingComment === comment._id ? (
                      <>
                        
                        <FontAwesomeIcon icon ={faSave} onClick={()=> handleSaveComment(comment._id)}/>
                        <FontAwesomeIcon icon={faTimes} onClick={()=>setEditingComment(null)}/>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faEdit} onClick={() => handleEditComment(comment._id, comment.content)} />
                        <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDeleteComment(comment._id)}/>
                      </>
                    )}
                  </div>
                )}
              </div>
              <p className='mt-0 mb-2 time-start ms-2'>{formatDateDistanceToNow(comment.createdAt)}</p>
            </div>
            {editingComment === comment._id ? (
              <div className='mb-4'>
                <textarea
                className='form-control'
                  type='text'
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                />
              </div>
            ) : (
              <div className='mb-4 content'>{comment.content}</div>
            )}
          </div>
        ))}
      </div>

    </div>
    </div>

    
</div>
    </>
  );
}
