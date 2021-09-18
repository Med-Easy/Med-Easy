import './Requests.scss';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../firebase';
import {
    Button,
    ButtonGroup,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Input,
    FormControl,
    FormLabel,
    Textarea
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useDistance from '../distance_calculator';
import CustomerCard from './CustomerCard';

function Requests() {
    const { currentUserCred, setCurrentUserCred } = useAuth();
    const [loading, setLoading] = useState(false);

    const [confirmedModal, setConfirmedModal] = useState(false);
    const [rejectedModal, setRejectedModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);

    const [reson, setReson] = useState(false);
    
    const [scrollBehavior, setScrollBehavior] = useState("inside")
    const confirmedRef = useRef();

    const openConfirmed = () => setConfirmedModal(true);
    const closeConfirmed = () => setConfirmedModal(false);

    const openRejected = () => setRejectedModal(true);
    const closeRejected = () => setRejectedModal(false);

    const openView = () => setViewModal(true);
    const closeView = () => setViewModal(false);

    const [currentMed, setCurrentMed] = useState({});

    const [newRequests, setNewRequests] = useState([]);
    const [confirmedRequests, setConfirmedRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);

    useEffect(() => {
        setLoading(true);

        const userDetails = JSON.parse(localStorage.getItem('user-details'));

        db.collection("users").where("email","==", userDetails.email).get()
        .then((snapshot) => {
            setCurrentUserCred(snapshot.docs[0].data());
            setNewRequests(snapshot.docs[0].data().requests.new);
            setConfirmedRequests(snapshot.docs[0].data().requests.confirmed)
            setRejectedRequests(snapshot.docs[0].data().requests.rejected)
        })
        .catch((e)=>{
            alert(e.message)
        })
        .finally(()=>{
            setLoading(false);
        })

    }, [])

    console.log('medicine requests', currentUserCred?.requests);

    // let lat1 = 26.524075;
    // let lon1 = 93.963188;

    // const result = useDistance(lat1, currentUserCred?.location.latitude, lon1, currentUserCred?.location.longitude);

    // console.log(result+" K.M.");

    const confimrHandler = (order) => {
        console.log(order);
        setCurrentMed(order);
        openView();
    }

    const openReason = () => {

    }

    {loading && <h1>Loading.....</h1>}
    return (
        <div className='requests-screen'>
            <Navbar />

            <div className='container'>
                <h1>Requests</h1>
                <h1>{currentUserCred?.email}</h1>
                <div>
                    <Button mr={4} colorScheme="teal" onClick={openConfirmed}>
                        Confirmed orders
                    </Button>
                    <Button colorScheme="teal" onClick={openRejected}>
                        Rejected orders
                    </Button>
                </div>

                <div className='medicine-requests-table'>
                    <Table variant='striped'>
                        <Thead>
                            <Tr>
                                <Th>Customer Name</Th>
                                <Th>Medicine</Th>
                                <Th>Qty.</Th>
                                <Th>Total Price</Th>
                                <Th>Distance (km)</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                newRequests.map((order, index) => {
                                    return (
                                        <Tr key={index}>
                                            <Td>{order.customer}</Td>
                                            <Td>{order.name}</Td>
                                            <Td>{order.quantity}</Td>
                                            <Td>{order.quantity * order.price_per_one}</Td>
                                            <Td>{order.distance}</Td>
                                            <Td>
                                                <Button mr={4} colorScheme="teal" onClick={()=>confimrHandler(order)}>
                                                    View
                                                </Button>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </div>
            </div>

            <>
                <Modal
                    isOpen={confirmedModal}
                    scrollBehavior={scrollBehavior}
                    size="xl"
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirmed Orders</ModalHeader>
                        <ModalBody>
                            {
                                confirmedRequests.map((order, index)=>{
                                    return(
                                        <CustomerCard
                                        key={index}
                                        order={order}
                                        />
                                    )
                                })
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={closeConfirmed}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>

            <>
                <Modal
                    isOpen={rejectedModal}
                    scrollBehavior={scrollBehavior}
                    size="xl"
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Rejected Orders</ModalHeader>
                        <ModalBody>
                            {
                                rejectedRequests.map((order, index)=>{
                                    return(
                                        <CustomerCard
                                        key={index}
                                        order={order}
                                        />
                                    )
                                })
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={closeRejected}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>

            <>
                <Modal
                    isOpen={viewModal}
                    scrollBehavior={scrollBehavior}
                    size="xl"
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>View Order</ModalHeader>
                        <ModalBody>
                            <div>
                                <div className='input'>
                                    <FormControl mb={4} id="shop-name">
                                        <FormLabel>Medicine</FormLabel>
                                        <Input type="text" required disabled value={currentMed?.name} />
                                    </FormControl>
                                </div>

                                <div className='input'>
                                    <FormControl mb={4} id="shop-name">
                                        <FormLabel>Brand</FormLabel>
                                        <Input type="text" required disabled value={currentMed?.company} />
                                    </FormControl>
                                </div>

                                <div className='form-row'>
                                    <div className='input col-lg-6'>
                                        <FormControl mb={4} id="shop-name">
                                            <FormLabel>Customer Name</FormLabel>
                                            <Input type="text" required disabled value={currentMed?.customer} />
                                        </FormControl>
                                    </div>

                                    <div className='input col-lg-6'>
                                        <FormControl mb={4} id="shop-name">
                                            <FormLabel>Distance</FormLabel>
                                            <Input type="text" required disabled value={currentMed?.distance} />
                                        </FormControl>
                                    </div>
                                </div>

                                <div className='form-row'>
                                    <div className='input col-lg-6'>
                                        <FormControl mb={4} id="shop-name">
                                            <FormLabel>Phone No.</FormLabel>
                                            <Input type="text" required disabled value={currentMed?.phone} />
                                        </FormControl>
                                    </div>

                                    <div className='input col-lg-6'>
                                        <FormControl mb={4} id="shop-name">
                                            <FormLabel>Date of order</FormLabel>
                                            <Input type="text" required disabled value={currentMed?.date?.slice(0, 15)} />
                                        </FormControl>
                                    </div>
                                </div>

                                <div className='input'>
                                    <FormControl mb={4} id="shop-name">
                                        <FormLabel>Full address</FormLabel>
                                        <Textarea required disabled value={currentMed?.address} />
                                    </FormControl>
                                </div>

                                <div className='form-row'>
                                    <div className='input col-lg-6'>
                                        <FormControl mb={4} id="shop-name">
                                            <FormLabel>Qty</FormLabel>
                                            <Input type="text" required disabled value={currentMed?.quantity} />
                                        </FormControl>
                                    </div>
                                    
                                    <div className='input col-lg-6'>
                                        <FormControl mb={4} id="shop-name">
                                            <FormLabel>Total Price</FormLabel>
                                            <Input type="text" required disabled value={currentMed?.quantity*currentMed?.price_per_one} />
                                        </FormControl>
                                    </div>
                                </div>

                                <Button style={{
                                    width: '100%'
                                }} mb={4} colorScheme="teal" >Cofirm Order</Button>
                                <br />
                                <Button style={{
                                    width: '100%'
                                }} onClick={()=>setReson(prev => !prev)}>{reson ? 'Cancel' : 'Reject Order'}</Button>

                                <div className='input' style={{
                                    display: reson ? 'block' : 'none'
                                }}>
                                    <FormControl mt={4} id="shop-name">
                                        <FormLabel>Decline Reason</FormLabel>
                                        <Textarea required />
                                    </FormControl>

                                    <br />

                                    <Button style={{
                                        width: '100%'
                                    }}>Submit</Button>
                                </div>

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={closeView}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        </div>
    )
}

export default Requests;
