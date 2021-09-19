import './SellerDashboard.scss'
import React, { useEffect, useState } from 'react';
import Navbar from "../../Components/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import { AuthContext, useAuth } from "../../Context/AuthContext";
import { useContext } from "react";
import { db } from "../../firebase";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
} from "@chakra-ui/react";
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
    const { currentUser, setCurrentUser, setCurrentUserCred, currentUserCred } = useAuth();

    const [loading, setLoading] = useState(false);
    
    
    useEffect(() => {
        setLoading(true);

        const userDetails = JSON.parse(localStorage.getItem('user-details'));

        db.collection("users").where("email","==", userDetails.email).get()
        .then((snapshot) => {
            console.log('Data at the dashboard', snapshot.docs[0].data());
            setCurrentUserCred(snapshot.docs[0].data());
        })
        .catch((e)=>{
            // setError(e.message);
            alert(e.message)
        })
        .finally(()=>{
            setLoading(false);
        })

    }, [])

    {loading && <h1>Loading.....</h1>}

    return (
        <Box>
            <Navbar/>
            <div className='container'>
                <h1>{currentUserCred?.email}</h1>
                <h1>Seller Dashboard</h1>
                <Link to='/seller/medicines' style={{
                    
                }}>Medicines</Link>
                <br />
                <Link to='/seller/medicines/requests'>Requests</Link>
                <Link to='/organisation/dashboard'>Organisations</Link>
                <Link to='/all/organisations'>Donate</Link>
            </div>

        </Box>
    );
}
 
export default SellerDashboard;