import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom'

// export default function ChangePass() {
//   const {email}=useParams();
//   const [newPassword, setNewPassword]=useState('');

//   const handleFormSubmit = async(e)=>{
//     e.prevenrDefault();
//     try{
//       const response = await axios.post('http://localhost:4000/users/resetPassword',{email,newPassword});
//       console.log(response.data);
//     }catch(error){
//       console.error("Error resetting password",error);
//     }
//   };
//   return (
//     <div>
//       <form onSubmit={handleFormSubmit}>
//       <h3>enter curent password</h3>
//         <input type='password' />
//         <h3>enter new password</h3>
//         <input type='password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
//         <button>submit</button>
//       </form>
//     </div>
//   )
// }

const ChangePass = ()=>{
const navigate = useNavigate();
  const {token} = useParams();
  const [newPassword,setNewPassword]=useState('');
  const [resetStatus,setResetStatus]=useState(null);

  const handleResetPassword = async(e)=>{
    e.preventDefault()
    try{
      const response = await axios.post('http://localhost:4000/users/resetPass',{
        resetToken:token,
        newPassword,
      });
      console.log("Full Response:",response);
      console.log("Message:",response.data.message);
      setResetStatus(response.data.message);
      navigate('/login');
    }catch(error){
      console.error('Error reseting password',error);
      setResetStatus('Error reseting password');
    }
    
  };


  return(
    <>
    {/* <div className='container'>
  
      <h2>Reset Password</h2>
      <label>New Password</label>
      <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
      <button onClick={handleResetPassword}>Reset Password</button>
      {resetStatus && <p>{resetStatus}</p>}
    </div> */}
    <div className='container d-flex justify-content-center p-5'>
        <div className='card p-5'>
    <p>Set a new password</p>
    {console.log("Reset Status:", resetStatus)};

    {resetStatus && <p>{resetStatus}</p>}
 


    <form className='row g-3' >
      <div className='col-12'>
                  <label className='form-label'>New Password</label>
                  <input
                    type='password'
                    className='form-control'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button type='button' onClick={handleResetPassword} className='btn btn-primary'>
                  Reset Password
                </button>
         
              </form>
              {resetStatus === 'Password successfully reset' ? (
  <h1>Your password has been successfully reset</h1>
) : null}
              </div>
      </div>
    </>
  )
};

export default ChangePass;