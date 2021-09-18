import { useState } from "react";
import { Box, Text, IconButton, Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import {  HamburgerIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";


const Navbar = () => {

    const [error, setError] = useState("");
    const history = useHistory();
    const { logout } = useAuth();

    async function handleLogout() {
        setError("");
    
        try {
          await logout();
          history.push("/login");
        } catch {
          setError("Failed to log out");
        }
    }

    return (
        <Box mb="12" display="flex" boxShadow="base" py="2">

            <Link>
            <Text fontSize="2xl" ml="5">
            MedEasy
            </Text>
            </Link>

            {/* <IconButton aria-label="Search database" icon={<SearchIcon />} /> */}
            {/* <IconButton ml="auto" mr="5" 
            aria-label="Search database"
            colorScheme="teal"
            w={8} 
            icon={<HamburgerIcon />} /> */}

            <Box ml="auto" mr="5">
            <Menu ml="auto" mr="5">
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Actions
            </MenuButton>
            <MenuList>
                <MenuItem onClick={ handleLogout }>Logout</MenuItem>
                {/* <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem> */}
            </MenuList>
            </Menu>
            </Box>



            {/* <Box display="flex">
                <Text>
                    <Link></Link>
                </Text>
            </Box> */}

        </Box>
    );
}
 
export default Navbar;