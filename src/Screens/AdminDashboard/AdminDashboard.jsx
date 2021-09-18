import { useEffect, useState } from "react";
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
  } from "@chakra-ui/react";
import Navbar from "../../Components/Navbar/Navbar";
import { db } from "../../firebase";

const AdminDashboard = () => {

    const [data, setData] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [currentSeller, setCurrentSeller] = useState({})
    // const { onToggle } = useDisclosure()

    useEffect(() => {
        db.collection("users")
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
                    <Td><Button onClick={()=>openModalView(result.data())}>Open Modal</Button></Td>
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
                <Tbody>
                    <Tr>
                    <Td pl="20">Certificate</Td>
                    <Td>
                        <Button mt="5" ml="5" onClick={()=>window.open(currentSeller.documents.shopCerificate, '_blank')}>View</Button>
                    </Td>
                    </Tr>
                    <Tr>
                    <Td pl="20">Identity</Td>
                    <Td>
                    <Button mt="5" ml="5" onClick={()=>window.open(currentSeller.documents.shopId, '_blank')}>View</Button>
                    </Td>
                    </Tr>
                    <Tr>
                    <Td pl="20">Shop Image</Td>
                    <Td>
                    <Button mt="5" ml="5" onClick={()=>window.open(currentSeller.documents.shopImage, '_blank')}>View</Button>
                    </Td>
                    </Tr>
                </Tbody>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={onClose}>
                    Accept
                    </Button>
                    <Button variant="ghost">Decline</Button>
                </ModalFooter>
                </ModalContent>
                </Modal>
                </>

            </Box>

        </div>  
    );
}
 
export default AdminDashboard;