import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Otp() {
    const location = useLocation();
    const email = location.state ? location.state.email : null;
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleOtpSubmit = async () => {
        if (!otp) {
            return alert('Please enter OTP');
        }
        try {
            const res = await axios.post('http://localhost:4000/users/otp', {
                email: email,
                otp: otp
            });

            if (res.data.success) {
                alert(res.data.message);
                navigate('/login');
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <div className="container mt-5">
                <div className="card">
                    <div className="card-body">
                        <h1 className="text-center">Verify OTP</h1>
                        <h2 className="text-center">Enter the OTP received in your email</h2>
                        <input
                            type="text"
                            className="form-control"
                            name="otp"
                            value={otp}
                            onChange={handleOtpChange}
                        />
                        <button className="btn btn-primary mt-3" onClick={handleOtpSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
