import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { Box, Center, Avatar, Text, Button, Heading } from "@chakra-ui/react"
import { db } from '../../firebase';

const NgoList = () => {

    const [data, setData] = useState("");

    useEffect(() => {
        db.collection("organisation_details")
        .get()
        .then(function(snapshot){
            console.log(snapshot);
            setData(snapshot);
        })
        .catch(function(err){
            console.log(err);
        })
    },[])

    return (
        <Box>
            <Navbar/>
            <Center>
                <Heading my="6" color="teal" display="block">
                    List of all available organisations
                </Heading>
            </Center>
            {/* <Center> */}
                { data &&
                <Center display="block" mx="33%">
                { data.docs.map( result => (
                <Box mt="5" boxShadow="2xl" p="10" key={ result.id }>
                    <Box display="flex" flexWrap="wrap" mt="5" mb="4">
                    <Box>
                        <Center>
                        <Avatar size="2xl" name="Segun Adebayo" src={ result.data().profile_pic } />
                        </Center>
                    </Box>
                    <Box ml="6">
                        <Text fontSize="2xl" fontWeight="600">{ result.data().name }</Text>
                        <Text>{ result.data().location }, district</Text>
                        <Text>{ result.data().email }</Text>
                    </Box> 
                    </Box>
                    <Link to={`/medicine/details/form/${ result.id }`}>
                    <Button w="8rem" mr="3" colorScheme="teal">Apply</Button>
                    </Link>     
                    <Link to={`/organisation/details/${ result.id }`}>
                    <Button w="8rem" colorScheme="teal" variant="outline">Details</Button>
                    </Link> 
                </Box>))}
                </Center>}
            {/* </Center> */}
        </Box>
    );
}
 
export default NgoList;