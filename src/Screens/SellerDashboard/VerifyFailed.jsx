import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { useAuth } from '../../Context/AuthContext';

const VerifyFailed = () => {
    const { currentUserCred } = useAuth();
    console.log('failed page', currentUserCred);

    return (
        <div>
            <Navbar />
            <h1>Verification failed</h1>
            <h1>{currentUserCred.verifyFailedReason}</h1>
        </div>
    )
}

export default VerifyFailed;
