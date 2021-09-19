import './Drugs.scss'
import React, { useState, useEffect, useRef } from 'react';
import {
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
    Button,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Select
} from "@chakra-ui/react";
import Navbar from '../../Components/Navbar/Navbar';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../firebase';
import { useDisclosure } from "@chakra-ui/react"

export default function Drugs() {
    const { currentUserCred } = useAuth();
    const [docId, setDocId] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure();

    const medicineRef = useRef();
    const priceRef = useRef();
    const brandRef = useRef();

    const updateMedicineRef = useRef();
    const updatePriceRef = useRef();
    const updateBrandRef = useRef();
    const updateStatusRef = useRef();

    const [currentMed, setCurrentMed] = useState({});

    const [medLoading, setMedLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const userDetails = JSON.parse(localStorage.getItem('user-details'));

    const [medicines, setMedicines] = useState([])
    useEffect(() => {
        db.collection("users").where("email","==", userDetails.email).get()
        .then(function(snapshot){
            console.log(snapshot.docs[0].id);
            setDocId(snapshot.docs[0].id);
            setMedicines(snapshot.docs[0].data().medicines)
        })
    },[])

    const editHandler = (medicine) => {
        console.log(medicine);
        setCurrentMed(medicine);
        onOpen();
    }
    const deleteHandler = (medicine) => {
        console.log(medicine);

        setDeleteLoading(true)
        db.collection("users").doc(docId).update({
            medicines: medicines.filter(item => item != medicine)
        })
        .then(function(){
            setMedicines(medicines.filter(item => item != medicine));
            console.log('action success');
        })
        .catch(e => {
            alert(e.message)
        })
        .finally(()=>{
            setDeleteLoading(false);
        })
    }

    const addMedicineHandler = (e) => {
        e.preventDefault();
        const newMedicine = {
            name: medicineRef.current.value,
            brand: brandRef.current.value,
            status: true,
            price: priceRef.current.value,
            id: Date.now()
        };

        setMedLoading(true);
        db.collection("users").doc(docId).update({
            medicines: [newMedicine, ...medicines]
        })
        .then(()=>{
            setMedicines(prev => [newMedicine, ...prev]);
            console.log('add success');

            medicineRef.current.value = "";
            brandRef.current.value = "";
            priceRef.current.value = "";
        })
        .catch((e)=>{
            alert(e.message)
        })
        .finally(()=>{
            setMedLoading(false);
        })
    }

    const updateMedicineHandler = (e) => {
        e.preventDefault();

        setUpdateLoading(true);
        const updatedMedicine = {
            name: updateMedicineRef.current.value,
            brand: updateBrandRef.current.value,
            status: updateStatusRef.current.value === 'true' ? true : updateStatusRef.current.value === 'false' ? false : '',
            price: updatePriceRef.current.value,
            id: currentMed?.id
        };

        console.log(updatedMedicine);

        db.collection("users").doc(docId).update({
            medicines: medicines.map((item, i) =>
                item.id === currentMed?.id ? updatedMedicine : item
            )
        })
        .then(()=>{
            setMedicines(prev => prev.map((item, i) =>
                item.id === currentMed?.id ? updatedMedicine : item
            ))
            console.log('update success');
        })
        .catch((e)=>{
            console.log(e);
        })
        .finally(()=>{
            setUpdateLoading(false);
            onClose();
        })
    }

    return (
        <div className='seller-drugs-page'>
            <Navbar />
            
            <div className='container'>
                
                <div className='form-container'>
                    <form onSubmit={addMedicineHandler}>
                        <div className='form-row'>
                            <div className='col-lg-4 input'>
                                <FormControl id="shop-name">
                                    <FormLabel>Medicine Name</FormLabel>
                                    <Input type="text" ref={medicineRef} required />
                                </FormControl>
                            </div>
                            <div className='col-lg-4 input'>
                                <FormControl id="shop-name">
                                    <FormLabel>Price per one unit</FormLabel>
                                    <Input type="text" ref={priceRef} required />
                                </FormControl>
                            </div>
                            <div className='col-lg-4 input'>
                                <FormControl id="shop-name">
                                    <FormLabel>Brand</FormLabel>
                                    <Input type="text" ref={brandRef} required />
                                </FormControl>
                            </div>
                        </div>

                        <Button type="submit" mt="4" mb="5" w="100%" colorScheme="teal" variant="solid">
                            Add
                            { medLoading &&
                                <Spinner ml="3"  color="white" />
                            }
                        </Button>
                    </form>
                </div>

                <div style={{
                    textAlign: 'center'
                }}>
                    { deleteLoading &&
                        <Spinner color="teal" size="xl" />
                    }
                </div>

                <div className='medicine-table'>
                    <Table variant='striped'>
                        <Thead>
                            <Tr>
                                <Th>Names</Th>
                                <Th>Company</Th>
                                <Th>Status</Th>
                                <Th>Price(per 1 unit)</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                medicines.map((medicine, index) => {
                                    return (
                                        <Tr key={medicine.id}>
                                            <Td>{medicine.name}</Td>
                                            <Td>{medicine.brand}</Td>
                                            <Td>{medicine.status ? 'In-Stock' : 'Out of Stock'}</Td>
                                            <Td>{medicine.price}</Td>
                                            <Td>
                                                <IconButton onClick={()=>deleteHandler(medicine)}>
                                                    <DeleteIcon />
                                                </IconButton>

                                                <IconButton onClick={()=>editHandler(medicine)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update medicine detials</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <div className='update-form-container'>
                        <form onSubmit={updateMedicineHandler}>
                            <div className='input'>
                                <FormControl mb={4} id="shop-name">
                                    <FormLabel>Medicine Name</FormLabel>
                                    <Input type="text" ref={updateMedicineRef} defaultValue={currentMed?.name} required />
                                </FormControl>
                            </div>
                            <div className='input'>
                                <FormControl mb={4} id="shop-name">
                                    <FormLabel>Price per one unit</FormLabel>
                                    <Input type="text" ref={updatePriceRef} defaultValue={currentMed?.price} required />
                                </FormControl>
                            </div>
                            <div className='input'>
                                <FormControl mb={4} id="shop-name">
                                    <FormLabel>Brand</FormLabel>
                                    <Input type="text" ref={updateBrandRef} defaultValue={currentMed?.brand} required />
                                </FormControl>
                            </div>
                            <div className='input'>
                                <FormControl mb={4} id="shop-name">
                                    <FormLabel>Status</FormLabel>
                                    <Select placeholder="Select option" ref={updateStatusRef} defaultValue={currentMed.status}>
                                        <option value={true}>In-Stock</option>
                                        <option value={false}>Out of Stock</option>
                                    </Select>
                                </FormControl>
                            </div>

                            <Button type="submit" mt="4" mb="5" w="100%" colorScheme="teal" variant="solid">
                                Update
                                { updateLoading &&
                                    <Spinner ml="3"  color="white" />
                                }
                            </Button>
                        </form>
                    </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}
