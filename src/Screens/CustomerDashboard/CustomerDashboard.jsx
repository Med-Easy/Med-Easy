import Navbar from "../../Components/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import { AuthContext, useAuth } from "../../Context/AuthContext";
import { useContext } from "react";

const CustomerDashboard = () => {
    const ctx = useContext(AuthContext);
    const { currentUserCred } = useAuth();
    
    const userDetails = JSON.parse(localStorage.getItem('user-details'));

    console.log('My context data at CustomerDashboard--->', userDetails);
    return (
        <Box>
            <Navbar/>
            <h1>{currentUserCred.email}</h1>
            <h1>Customer Dashboard</h1>
        </Box>
    );
}
 
export default CustomerDashboard;