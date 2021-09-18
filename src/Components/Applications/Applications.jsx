import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Box, Center, Heading, Text } from "@chakra-ui/layout";
import { Image, Link, Code, Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, } from "@chakra-ui/react"
import { db } from '../../firebase';
import { useAuth } from "../../Context/AuthContext";

const Applications = () => {

    const { currentUser } = useAuth();
    const [data, setData] = useState("");
    const [id, setId] = useState("");
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
                // setData(snapshot);
                console.log(snapshot.docs[0].id);
                // const mark = snapshot.docs[0].id;
                // setId(mark);
                // console.log(id);

                db.collection("medicine-form")
                .where("identfier","==",snapshot.docs[0].id)
                .get()
                .then(function(res){
                    console.log(res.docs);
                    setData(res);
                })
            }
        })
    },[currentUser.uid])

    return (
        <Box>

            { data &&
            <Box>
            { data.docs.map( result => (
                <Box mt="5" key={ result.id } boxShadow="2xl" p="5">
                    <Heading fontSize="2xl">
                        Request to donate { result.data().medicine_name }
                    </Heading>

                    <Text mt="3">Chat ID <Code colorScheme="teal" children={ result.data().email } /></Text>
                    <Text mt="4" mb="5">
                        I am { result.data().name } and I want to donate my medicine,
                        { result.data().medicine_name }. I would be very grateful to
                        contribute to this cause. Kindly connect my donation.
                    </Text>
                    <Code my="3" colorScheme="red" children={`Medicine expiring on ${ result.data().expire_date }`} />

                    <Accordion mt="6" allowToggle>
                    <AccordionItem>
                        <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                            View in details
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Box>
                            <Text>Email - { result.data().email }</Text>
                            <Text>Contact no. - { result.data().contact }</Text>
                            <Text>Address - { result.data().address }</Text>
                            </Box>
                            <Center>
                            <Box my="6" display="flex" flexWrap="wrap">
                            <Link target="blank" href={ result.data().med_img.img_one }>
                            <Image mr="2" boxSize="200px" src={ result.data().med_img.img_one } alt="Dan Abramov" />
                            </Link>
                            <Link target="blank" href={ result.data().med_img.img_second }>
                            <Image mr="2" boxSize="200px" src={ result.data().med_img.img_second } alt="Dan Abramov" />
                            </Link>
                            </Box>
                            </Center>
                        </AccordionPanel>
                    </AccordionItem>

                    </Accordion>

                    {/* <Button mt="3" mr="3" colorScheme="teal">Accept</Button>
                    <Button mt="3" colorScheme="red">Decline</Button> */}

                </Box>))}
                </Box>}
        </Box>
    );
}
 
export default Applications;