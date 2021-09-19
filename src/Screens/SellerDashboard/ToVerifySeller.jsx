import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { useAuth } from '../../Context/AuthContext';

const ToVerifySeller = () => {
    const ctx = useAuth();
    console.log(ctx.currentUser);
    return (
        <div>
            <Navbar />
            <h1>You have successfully submitted your details. Please wait a day or so to get verified by the User Admin</h1>
        </div>
    )
}

export default ToVerifySeller;
