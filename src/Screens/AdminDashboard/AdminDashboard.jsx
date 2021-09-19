import { useEffect, useRef, useState } from "react";
import { Box, Center, Avatar, Button, Table, Thead, Tr, Th, Tbody, Td, Fade } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Textarea,
  } from "@chakra-ui/react";
import Navbar from "../../Components/Navbar/Navbar";
import { db } from "../../firebase";
import { Image } from "@chakra-ui/react"

const AdminDashboard = () => {

    const [data, setData] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [currentSeller, setCurrentSeller] = useState({});
    const [currentDocId, setCurrentDocId] = useState('')
    // const { onToggle } = useDisclosure()

    const [reson, setReson] = useState(false);

    const declineRef = useRef();

    useEffect(() => {
        db.collection("users").where("type", "==", "Seller").where("isVerified", "==", false).where("verifyProgress", "==", true)
        .get()
        .then(function(snapshot){
            console.log(snapshot.docs);
            setData(snapshot);
        })
        .catch(function(err){
            console.log(err);
        })
    },[])

    const openModalView = (data) => {
        setCurrentSeller(data);
        onOpen();
    }

    const acceptHandler = () => {
        console.log(currentDocId);;
        db.collection("users").doc(currentDocId).update({
            isVerified: true,
            verifyProgress: false,
            useVerified: 'verified',
        })
        .then(()=>{
            alert('User verified Sucessfully');
            window.reload();
        })
        .catch((e)=>[
            alert(e.message)
        ])
    }

    const declineHandler = () => {
        console.log(currentDocId);;
        db.collection("users").doc(currentDocId).update({
            isVerified: false,
            verifyProgress: false,
            userVerified: 'cancelled',
            verifyFailedReason: declineRef.current.value,
        })
        .then(()=>{
            alert('User verified Sucessfully');
            window.reload();
        })
        .catch((e)=>[
            alert(e.message)
        ])
        .finally(()=>{
            onClose();
        })
    }

    return (
        <div className="container">
            <Navbar/>
            <Box>

                <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                    <Th>Shop Name</Th>
                    <Th>Display name</Th>
                    <Th>Location</Th>
                    <Th>Details</Th>
                    </Tr>
                </Thead>
                { data &&
                <Tbody>
                { data.docs.map( result => (
                    <Tr>
                        <Td>{ result.data().shopName }</Td>
                        <Td>{ result.data().displayName }</Td>
                        <Td>{ result.data().state }</Td>
                        <Td><Button onClick={()=>{
                            openModalView(result.data());
                            setCurrentDocId(result.id)
                        }}>Open Modal</Button></Td>
                    </Tr>
                ))}
                </Tbody>}
                </Table>

                <>
                    <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Seller application</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <div>
                        <div style={{
                            marginBottom: '20px'
                        }}>
                            <p>Certificate: </p>
                            <p>
                                {currentSeller?.documents?.shopCerificate && <Image src={currentSeller?.documents?.shopCerificate} alt="Segun Adebayo" boxSize="300px" objectFit="cover" />}
                                {!currentSeller?.documents?.shopCerificate && <b>No Image</b>}
                            </p>
                        </div>
                        <div style={{
                            marginBottom: '20px'
                        }}>
                            <p pl="20">Identity: </p>
                            <p>
                                {currentSeller?.documents?.shopId && <Image src={currentSeller?.documents?.shopId} alt="Segun Adebayo" boxSize="300px" objectFit="cover" />}
                                {!currentSeller?.documents?.shopId && <b>No Image</b>}
                            </p>
                        </div>
                        <div style={{
                            marginBottom: '20px'
                        }}>
                            <p pl="20">Shop Image: </p>
                            <p>
                                {currentSeller?.documents?.shopImage && <Image src={currentSeller?.documents?.shopImage} alt="Segun Adebayo" boxSize="300px" objectFit="cover" />}
                                {!currentSeller?.documents?.shopImage && <b>No Image</b>}
                            </p>
                        </div>
                    </div>
                    </ModalBody>

                    <div style={{
                        padding: '20px'
                    }}>
                        <Button colorScheme="teal" mr={3} onClick={acceptHandler}>
                            Accept
                        </Button>
                        <Button onClick={()=>setReson(prev => !prev)}>{reson ? 'Cancel' : 'Decline'}</Button>

                        <br />

                        <div className='input' style={{
                            display: reson ? 'block' : 'none'
                        }}>
                            <FormControl mt={4} id="shop-name">
                                <FormLabel>Decline Reason</FormLabel>
                                <Textarea ref={declineRef} required />
                            </FormControl>

                            <br />

                            <Button style={{
                                width: '100%'
                            }} onClick={()=>declineHandler()}>Submit</Button>
                        </div>
                    </div>
                    </ModalContent>
                    </Modal>
                </>

            </Box>

        </div>  
    );
}
 
export default AdminDashboard;