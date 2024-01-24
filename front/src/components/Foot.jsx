import React from 'react'
import './foot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faDribbble, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Logo from './logo/logo.png';
export default function Foot() {
  return (
    <>
   <footer className='container-fluid bg-light p-5 '>
    <div className='container'>
        <div className='row'>
        <div className='col-lg-3'>
            <div className='logo pb-4 pt-4'>
            <img src={Logo} alt="logo"  className='logo-img '/>
            </div>
            <p className='foot-p text-muted'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus accusamus ullam natus impedit harum voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, sunt?</p>
            <div className='icons'>
                <a href="https://www.twitter.com">
                <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="https://www.facebook.com">
                <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://www.dribbble.com">
                <FontAwesomeIcon icon={faDribbble} />
                </a>
                <a href="https://www.instagram.com">
                <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://www.youtube.com">
                <FontAwesomeIcon icon={faYoutube} />
                </a>
            </div>
        </div>
        <div className='col-lg-3 lists'>
            <div className='link-title pt-4 pb-4 '>Useful Links</div>
            <ul>
                <li>
                    <a href="/privacyPolicy">Privacy Policy</a>
                </li>
                <li>
                    <a href="/contactUs">Contact Us</a>
                </li>
                <li>
                    <a href="/termsConditions">T&C</a>
                </li>
                <li>
                    <a href="/aboutUs">About Us</a>
                </li>
                <li>
                    <a href="/blogs">Blog</a>
                </li>
            </ul>
        </div>
        <div className='col-lg-3 lists'>
            <div className='link-title pt-4 pb-4 '>Useful Links</div>
            <ul>
                <li>
                    <a href="/privacyPolicy">Privacy Policy</a>
                </li>
                <li>
                    <a href="/contactUs">Contact Us</a>
                </li>
                <li>
                    <a href="/termsConditions">T&C</a>
                </li>
                <li>
                    <a href="/aboutUs">About Us</a>
                </li>
                <li>
                    <a href="/blogs">Blog</a>
                </li>
            </ul>
        </div>
        <div className='col-lg-3 lists pt-4 ps-0 pe-0'>
            <div className='card shadow p-4'>
                <div className='row mb-3'>
                    <div className='col-2 text-center'>
                    <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div className='col-10 text-center'>
                        +91-123-456-7890
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-2 text-center'>
                    <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className='col-10 text-center'>
                        example@example.com
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-2 text-center'>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div className='col-10 text-center'>
                        123 Main ST, City , Country
                    </div>
                </div>
            </div>
        </div>
        </div>
        
    </div>
   </footer>
    <div className='container-fluid bg-dark text-white p-3 text-center'>
 
   Copyright © 2023 Belle Chic. All rights reserved.
   
    </div>
    </>
  )
}
