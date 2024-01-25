
import React from 'react';
import { Link}from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
const Success = () => {
 
  return (
    <div className='container text-center d-flex align-items-center justify-content-center'>
      <div className='card shadow p-4 m-2 success'>
      <FontAwesomeIcon icon={faCheckCircle} size='5x' color='green' className='m-3'/>
      <h1 className='mt-3'>Payment Successful</h1>
      <p className='text-success m-4'>Your payment is successful and order is confirmed. You will receive an order confirmation on email shortly with the expected delivery date for your order.</p>
      <div>
      <button className='btn btn-success col-lg-4 col-md-4'>
      <Link to='/' style={{ textDecoration: 'none', color: 'white' }}>
        Continue Shopping
        </Link>
        </button>
      </div>
      </div>
    </div>
  );
};

export default Success;
