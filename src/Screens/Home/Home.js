import Navbar from "../../Components/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import { AuthContext, useAuth } from "../../Context/AuthContext";
import { useContext } from "react";

const Home = () => {
    const ctx = useContext(AuthContext);
    
    const userDetails = JSON.parse(localStorage.getItem('user-details'));

    console.log('My context data at Home--->', userDetails);
    return (
        <Box>
            <Navbar/>
            <h1>This is home</h1>
        </Box>
    );
}
 
export default Home;