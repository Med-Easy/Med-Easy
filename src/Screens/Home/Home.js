import Navbar from "../../Components/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import { useAuth } from "../../Context/AuthContext";

const Home = () => {

    const { currentUser } = useAuth();

    return (
        <Box>
            <Navbar/>

            <h1>{ currentUser.email }</h1>
        </Box>
    );
}
 
export default Home;