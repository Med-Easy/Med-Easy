import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../../Components/Navbar/Navbar';
import { useAuth } from '../../../Context/AuthContext';
import { db } from '../../../firebase';
import {
    Heading,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Select,
    Spinner,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from "@chakra-ui/react";
import SellerCard from '../SellerCard';
import { useDisclosure } from "@chakra-ui/react"


export default function FindMed() {
    const { currentUser, setCurrentUser, setCurrentUserCred, currentUserCred } = useAuth();

    const [docId, setDocId] = useState('');

    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    
    const [medicineList, setMedicineList] = useState([]);
    const [allMedicines, setAllMedicines] = useState([]);

    const [currentSeller, setCurrentSeller] = useState({});

    const [allSellers, setAllSellers] = useState([]);
    const [noItems, setNoItems] = useState(1);
    const [totalCost, setTotalCost] = useState(0);

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const medNameRef = useRef();
    const stateRef = useRef();
    const cityRef = useRef();

    const { isOpen, onOpen, onClose } = useDisclosure();

    function calcDistance(lat1, lat2, lon1, lon2){

        lon1 =  lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
    
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2),2);
    
        let c = 2 * Math.asin(Math.sqrt(a));
    
        let r = 6371;
    
        return(c * r);
    }
    
    useEffect(() => {
        setLoading(true);

        const userDetails = JSON.parse(localStorage.getItem('user-details'));

        db.collection("users").where("email","==", userDetails.email).get()
        .then((snapshot) => {
            console.log('Data at find med', snapshot.docs[0].data());
            setCurrentUserCred(snapshot.docs[0].data());
        })
        .catch((e)=>{
            alert(e.message)
        })
        .finally(()=>{
            setLoading(false);
        })

    }, []);

    // FUNCTIONS FOR RENDERING STATES AND CITIES START
    useEffect(()=>{
        let headers = new Headers();
        headers.append("X-CSCAPI-KEY", "azBkUzFVMzBHOGJiMnFQYTQ2a3F4NkVXYzIwaDFhVUZwS0FiVnQyTQ==");
        
        let requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };
        
        fetch("https://api.countrystatecity.in/v1/countries/IN/states", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(JSON.parse(result));
            setStates(JSON.parse(result));
        })
        .catch(error => console.log('error', error));
    }, [])
    
    const stateHandler = (e) => {
        setSelectedState(e.target.value);
        let code = (e.target.value).slice((e.target.value).length-3, (e.target.value).length-1);
        console.log(code);
        let headers = new Headers();
        headers.append("X-CSCAPI-KEY", "azBkUzFVMzBHOGJiMnFQYTQ2a3F4NkVXYzIwaDFhVUZwS0FiVnQyTQ==");
        
        let requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };
        
        fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${code}/cities`, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(JSON.parse(result));
            setCities(JSON.parse(result));
        })
        .catch(error => console.log('error', error));
    }
    // FUNCTIONS FOR RENDERING STATES AND CITIES END

    const handleSearchMedicine = (e) => {
        e.preventDefault();
        setSearchLoading(true);

        setAllSellers([]);

        db.collection("users").where("type","==", 'Seller').where("state", "==", stateRef.current.value).where("city", "==", cityRef.current.value).get()
        .then((snapshot) => {
            snapshot.docs.map((item) => {
                if(item.data().medicines.find(o => o.name === medNameRef.current.value)){
                    setAllSellers(prev => [item.data(), ...prev]);
                }
            })
        })
        .catch((e)=>{
            alert(e.message);
        })
        .finally(()=>{
            setSearchLoading(false);
        })
    }

    const viewSeller = (seller) => {
        setCurrentSeller(seller);
        onOpen();
    }

    const placeOrderHandler = (e) => {
        e.preventDefault();

        const orderDetails = {
            address: currentUserCred.address.add1+" "+currentUserCred.address.add2,
            company: (currentSeller.medicines.find(o => o.name === medNameRef.current.value)).brand,
            confirmed: false,
            customer: currentUserCred.displayName,
            date: (new Date()).toDateString(),
            declineReason: '',
            distance: (calcDistance(currentUserCred.location.latitude, currentSeller.location.latitude, currentUserCred.location.longitude, currentSeller.location.longitude)).toFixed(1),
            name: medNameRef.current.value,
            phone: currentSeller.contact,
            price_per_one: (currentSeller.medicines.find(o => o.name === medNameRef.current.value)).price,
            quantity: noItems
        }

        setOrderLoading(true);
        db.collection("users").where("email","==", currentSeller.email).get()
        .then((snapshot) => {
            let values = snapshot.docs[0].data().requests.new;
            const doc_id = snapshot.docs[0].id;
            console.log(doc_id);
            console.log([orderDetails, ...values]);

            db.collection("users").doc(doc_id).update({
                requests: {
                    confirmed: snapshot.docs[0].data().requests.confirmed,
                    rejected: snapshot.docs[0].data().requests.rejected,
                    new: [orderDetails, ...values],
                }
            })
            .then(function(){
                alert('Order Place Successfully. You will contacted by the seller if your order is confirmed');
            })
            .catch(e => {
                alert(e.message);
            })
            .finally(()=>{
                setOrderLoading(false);
                onClose();
            })
        })
        .catch((e)=>{
            alert(e.message);
        })
        .finally(()=>{
            setOrderLoading(false);
        })

        console.log(orderDetails);
    }

    if(loading) return (<h1>Loading.....</h1>);
    console.log('value ----->', medicineList);

    console.log('all sellers', allSellers);

    return (
        <div>
            <Navbar />
            <div className='container'>
                <h1>Find Med</h1>
                <form onSubmit={handleSearchMedicine}>
                    <div className='input'>
                        <FormControl mt={4} id="address1">
                            <FormLabel>Search medicine name</FormLabel>
                            <Input type="text" ref={medNameRef} required />
                        </FormControl>
                    </div>

                    <div className='form-row input'>
                        <div className='col-lg-6'>
                            <FormControl id="state">
                                <FormLabel>State</FormLabel>
                                <Select placeholder="Select state" onChange={stateHandler} ref={stateRef}>
                                    {
                                        states.map((state, index)=>{
                                            return <option key={state.id} value={state.name+" ("+state.iso2+")"} >{state.name}</option>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-lg-6'>
                            <FormControl id="city">
                                <FormLabel>City</FormLabel>
                                <Select placeholder="Select city" onChange={e => setSelectedCity(e.target.value)} ref={cityRef}>
                                    {
                                        cities?.map((city, index)=>{
                                            return <option key={city.id} value={city.name}>{city.name}</option>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <Button type="submit" mt={4} w='100%' colorScheme='teal'>Search</Button>
                </form>

                <div className='sellers-list'>
                    <div style={{
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        {
                            searchLoading && <Spinner
                                thickness="4px"
                                speed="0.65s"
                                // emptyColor="gray.200"
                                color="blue.500"
                                size="xl"
                                colorScheme='teal'
                            />
                        }
                    </div>
                    <div className='row'>
                        {
                            allSellers.map((seller) => {
                                return (
                                    <div className='col-lg-4' style={{
                                        padding: '20px'
                                    }}>
                                        <SellerCard
                                        seller={seller}
                                        image={seller.documents.shopImage}
                                        seller_name={seller.shopName}
                                        med_name=''
                                        seller_add={seller.shopAddress.line1+", "+seller.shopAddress.line2}
                                        seller_phone=''
                                        med_price={seller.medicines.find(o => o.name === 'Paracetamol')}
                                        distance={(calcDistance(currentUserCred.location.latitude, seller.location.latitude, currentUserCred.location.longitude, seller.location.longitude)).toFixed(1)}
                                        viewSeller={viewSeller}
                                        noItems={noItems}
                                        setTotalCost={setTotalCost}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>

            <>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Seller Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <div className='update-form-container'>
                            <form onSubmit={placeOrderHandler}>

                                <div>
                                    <Slider defaultValue={noItems} min={1} max={10} step={1} onChange={(e)=>setNoItems(e)}>
                                        <SliderTrack >
                                            <SliderFilledTrack colorScheme='teal'/>
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </div>

                                <div>
                                    <p>Qty: {noItems}</p>
                                    <p>Total cost: Rs. {totalCost}</p>
                                </div>

                                <Button type="submit" mt="4" mb="5" w="100%" colorScheme="teal" variant="solid">
                                    Place Order
                                </Button>
                            </form>
                        </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        </div>
    )
}
