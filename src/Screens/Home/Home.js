import Navbar from "../../Components/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import { AuthContext, useAuth } from "../../Context/AuthContext";
import { useContext } from "react";

const Home = () => {
    const ctx = useContext(AuthContext);
    const { currentUser } = useAuth();
    
    const userDetails = JSON.parse(localStorage.getItem('user-details'));

    console.log('My context data at Home--->', userDetails);
    return (
        <Box>
            <Navbar/>
            <h1>{currentUser.email}</h1>
        </Box>
    );
}
 
export default Home;