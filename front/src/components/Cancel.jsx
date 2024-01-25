import React from 'react';
import { Link}from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
const Cancel = () => {
 
  return (
    <div className='container text-center d-flex align-items-center justify-content-center'>
      <div className='card shadow p-4 m-2 success'>
      <FontAwesomeIcon icon={faCircleXmark} size='5x' color='red' className='m-3'/>
      <h1 className='mt-3'>Payment Failed</h1>
      <p className='text-danger m-4'>There might be an error in processing the paymnet. Try Again</p>
      <div>
      <button className='btn btn-danger col-lg-4 col-md-4'>
        <Link to='/cart' style={{textDecoration:'none', color:"white"}}>
        Try Again
        </Link>
        </button>
      </div>
      </div>
    </div>
  );
};

export default Cancel;
