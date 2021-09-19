import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../Components/Navbar/Navbar';
import { useAuth } from '../../../Context/AuthContext';
import { db } from '../../../firebase';
import useDistance from '../../distance_calculator';

export default function CustomerDashboard() {
    const { currentUser, setCurrentUser, setCurrentUserCred, currentUserCred } = useAuth();

    const [loading, setLoading] = useState(false);
    
    
    useEffect(() => {
        setLoading(true);

        const userDetails = JSON.parse(localStorage.getItem('user-details'));

        db.collection("users").where("email","==", userDetails.email).get()
        .then((snapshot) => {
            console.log('Data at the customer dashboard', snapshot.docs[0].data());
            setCurrentUserCred(snapshot.docs[0].data());
        })
        .catch((e)=>{
            alert(e.message)
        })
        .finally(()=>{
            setLoading(false);
        })

    }, [])

    if(loading) return (<h1>Loading.....</h1>);

    return (
        <div>
            <Navbar />
            <div className='container'>
                <h1>{currentUserCred?.email}</h1>
                <h1>Customer Dashboard</h1>
                <Link to='/customer/find-medicines'>
                    Find Medicines
                </Link>
                <br />
                <Link to='/organisation/dashboard'>Organisations</Link>
                <br />
                <Link to='/all/organisations'>Donate</Link>
            </div>
        </div>
    )
}
