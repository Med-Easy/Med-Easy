import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Box, Center } from "@chakra-ui/layout";
import { FormControl, Avatar, Text, Badge, Button } from "@chakra-ui/react";
import { useAuth } from "../../Context/AuthContext";
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { db } from '../../firebase';

const NgoDashboard = () => {

    const { currentUser } = useAuth();
    const [data, setData] = useState("");
    const history = useHistory();

    useEffect(() => {
        db.collection("organisation_details")
        .where("user_uid","==",currentUser.uid)
        .get()
        .then(function(snapshot){
            if(snapshot.docs.length === 0){
                history.push("/register/organisation");
            }
            else{
                console.log(snapshot);
                setData(snapshot);
            }
        })
        .catch(function(err){
            console.log(err);
        })
    },[currentUser.uid])



    return (
        <Box mt="10">
            {data &&
            <>
            { data.docs.map( result => (
            <Box key={ result.id }>

            <Link to={`/edit/organisation/details/${result.id}`}>
            <Button w="8rem" colorScheme="teal">Edit Profile</Button>
            </Link>

            <Box mb="5" mt="5">
                <Center>
                <Avatar size="2xl" name="Segun Adebayo" src={ result.data().profile_pic } />
                </Center>
            </Box>

            <hr />

            <Box mt="8">

                <Box>
                <FormControl mt="3">
                <Badge colorScheme="green" px="3">Organisation name</Badge>
                <Text fontSize="3xl" mb="5" color="teal" fontWeight="700">{ result.data().name }</Text>
                </FormControl> 

                <FormControl mt="3">
                <Badge colorScheme="green" px="3">Website</Badge>
                <a target="blank" href={ result.data().website }>
                <Text color="blue" mt="2">{ result.data().website }</Text>
                </a>
                </FormControl> 

                <Box display="flex"> 
                <FormControl mt="3">
                <Badge colorScheme="green" px="3">Owner name</Badge>
                <Text fontSize="xl" ml="2">{ result.data().owner_name }</Text>
                </FormControl> 

                <FormControl mt="3" ml="3">
                <Badge colorScheme="green" px="3">Email address</Badge>
                <Text fontSize="xl">{ result.data().email }</Text>  
                </FormControl> 
                </Box>

                <Box display="flex"> 
                <FormControl mt="3">
                <Badge colorScheme="green" px="3">Contact no.</Badge>
                <Text fontSize="xl" ml="2">{ result.data().contact }</Text>
                </FormControl> 

                <FormControl mt="3" ml="3">
                <Badge colorScheme="green" px="3">Location</Badge>
                <Text fontSize="xl">{ result.data().location }</Text>  
                </FormControl> 
                </Box>

                </Box>

                <FormControl mt="5" id="email">
                <Badge colorScheme="green" px="3">Description</Badge>
                <Text fontSize="xl">{ result.data().description }</Text> 
                </FormControl>  

                <FormControl mt="5" id="email">
                <Badge colorScheme="green" px="3">Address</Badge>
                <Text fontSize="xl">{ result.data().address }</Text> 
                </FormControl>    

            </Box>
            </Box>))}
            </>}
        </Box>
    );
}
 
export default NgoDashboard;