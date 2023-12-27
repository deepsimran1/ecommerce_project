import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';
export default function AdminForget() {
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const [resetStatus,setResetStatus]=useState(null);
  const handleFormSubmit = async(e)=>{
    e.preventDefault();

    try{
      const response = await axios.post('http://localhost:4000/users/forgetAdminPass',{email});
      console.log("response",response);
      console.log(response.data);
      setResetStatus('Reset link sent successfully');
      alert('Reset link sent successfully');
      navigate('/admin');
    }catch(error){
      console.error("error",error);
      setResetStatus('Error sending Link');
    }
  }
  return (
    <>
    <div className='container d-flex justify-content-center p-5'>
        <div className='card p-5'>
            <h2>Forget your password ?</h2>
            {resetStatus && <p>{resetStatus}</p>}
            <p>Please enter the email to login to your account</p>
            <form className="row g-3" onSubmit={handleFormSubmit}>
            <div className="col-12">
              <label className="form-label">Enter your email</label>
              <input type="email" className="form-control" placeholder="example@gmail.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
              <button type="submit" className="btn btn-primary">
                Request Password Reset
              </button>
              <div className='col-12 cen'>
                <Link to='/admin'>Back to Login</Link>
              </div>
              <div className='col-12 cen'>
                <Link to='/adminSignup'>Create an Account</Link>
              </div>
            </form>
        </div>
    </div>
    </>
  )
}
