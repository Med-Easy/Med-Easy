import './RegisterSeller.scss'
import React, { useState, useEffect, useRef } from 'react';
import {
    Heading,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Select,
    Spinner,
    Button
} from "@chakra-ui/react";
import { geolocated } from "react-geolocated";
import { storage, db } from '../../firebase';
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react"
import Navbar from '../../Components/Navbar/Navbar';
import { useHistory } from 'react-router';

const timings = [
    '12:00 am',
    '01:00 am',
    '02:00 am',
    '03:00 am',
    '04:00 am',
    '05:00 am',
    '06:00 am',
    '07:00 am',
    '08:00 am',
    '09:00 am',
    '10:00 am',
    '11:00 am',
    '12:00 pm',
    '01:00 pm',
    '02:00 pm',
    '03:00 pm',
    '04:00 pm',
    '05:00 pm',
    '06:00 pm',
    '07:00 pm',
    '08:00 pm',
    '09:00 pm',
    '10:00 pm',
    '11:00 pm',
]

const RegisterSeller = ({ coords }) => {
    const history = useHistory();
    const userDetails = JSON.parse(localStorage.getItem('user-details'));
    console.log(coords);

    const [loading, setLoading] = useState(false);

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [shopImage, setShopImage] = useState('');
    const [localShopImage, setLocalShopImage] = useState('');

    const [shopId, setShopId] = useState('');
    const [localShopId, setLocalShopId] = useState('');

    const [shopCerificate, setShopCerificate] = useState('');
    const [localShopCerificate, setLocalShopCerificate] = useState('');

    const [shopImageUrl, setShopImageUrl] = useState('');
    const [shopIdUrl, setShopIdUrl] = useState('');
    const [shopCerificateUrl, setShopCerificateUrl] = useState('');

    const [progress1, setProgress1] = useState(0);
    const [progress2, setProgress2] = useState(0);
    const [progress3, setProgress3] = useState(0);

    const [imgUploading1, setImgUploading1] = useState(false);
    const [imgUploading2, setImgUploading2] = useState(false);
    const [imgUploading3, setImgUploading3] = useState(false);

    const [docId, setDocId] = useState('');
    const shopNameRef = useRef();
    const ownerRef = useRef();
    const contactRef = useRef();
    const address1Ref = useRef();
    const address2Ref = useRef();
    const pinRef = useRef();
    const stateRef = useRef();
    const cityRef = useRef();
    const deliveryRef = useRef();
    const openingTimeRef = useRef();
    const closingTimeRef = useRef();

    // SECTION FOR UPLOADING IMAGES START
    const handleShopImageChange = (event) => {
        if (event.target.files[0]) {
            setImgUploading1(true);

            setShopImage(event.target.files[0]);
            let reader = new FileReader();
            reader.onload = (e) => {
            };
            reader.readAsDataURL(event.target.files[0]);

            let val=event.target.files[0];
            let imageName = Date.now();
            const uploadTask = storage.ref(`docs-images/${imageName}`).put(val);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log(progress);
                    setProgress1(progress);
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref()
                    .child('docs-images/'+imageName)
                    .getDownloadURL()
                    .then(url => {
                        console.log('this is the image url', url);
                        setShopImageUrl(url);
                        setImgUploading1(false);
                        setProgress1(0);
                    });
                }
            );
        }
    }

    const handleShopIdChange = (event) => {
        if (event.target.files[0]) {
            setImgUploading2(true);

            setShopId(event.target.files[0]);
            let reader = new FileReader();
            reader.onload = (e) => {
            };
            reader.readAsDataURL(event.target.files[0]);

            let val=event.target.files[0];
            let imageName = Date.now();
            const uploadTask = storage.ref(`docs-images/${imageName}`).put(val);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log(progress);
                    setProgress2(progress);
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref()
                    .child('docs-images/'+imageName)
                    .getDownloadURL()
                    .then(url => {
                        console.log('this is the image url', url);
                        setShopIdUrl(url);
                        setImgUploading2(false);
                        setProgress2(0);
                    });
                }
            );
        }
    }

    const handleShopCertificateChange = (event) => {
        if (event.target.files[0]) {
            setImgUploading3(true);

            setShopCerificate(event.target.files[0]);
            let reader = new FileReader();
            reader.onload = (e) => {
            };
            reader.readAsDataURL(event.target.files[0]);

            let val=event.target.files[0];
            let imageName = Date.now();
            const uploadTask = storage.ref(`docs-images/${imageName}`).put(val);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log(progress);
                    setProgress3(progress);
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref()
                    .child('docs-images/'+imageName)
                    .getDownloadURL()
                    .then(url => {
                        console.log('this is the image url', url);
                        setShopCerificateUrl(url);
                        setImgUploading3(false);
                        setProgress3(0);
                    });
                }
            );
        }
    }
    // SECTION FOR UPLOADING IMAGES END

    // EXTRACTING THE USER DETAILS START
    useEffect(() => {
        db.collection("users").where("user_uid","==", userDetails.user_uid).get()
        .then((snapshot) => {
            console.log(snapshot.docs[0].id)
            setDocId(snapshot.docs[0].id);
        })
    },[])
    // EXTRACTING THE USER DETAILS END

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
    

    //USER REGISTERING THE ACCOUNT START
    const submitHandler = (e) => {
        e.preventDefault();

        const userCred = {
            displayName: userDetails.displayName,
            email: userDetails.email,
            fName: userDetails.fName,
            lName: userDetails.lName,
            user_uid: userDetails.user_uid,
            _id: userDetails._id,
            haveNgo: false,
            type: userDetails.type,
            isVerified: false,
            verifyProgress: true,
            userVerified: 'no', //no, cancelled, verified
            documents: {
                shopCerificate: shopCerificateUrl,
                shopId: shopIdUrl,
                shopImage: shopImageUrl,
            },
            location: {
                latitude: coords.latitude,
                longitude: coords.longitude
            },
            owner: ownerRef.current.value,
            shopName: shopNameRef.current.value,
            shopAddress: {
                line1: address1Ref.current.value,
                line2: address2Ref.current.value,
                pin: pinRef.current.value
            },
            state: stateRef.current.value,
            city: cityRef.current.value,
            contact: contactRef.current.value,
            deliveryType: deliveryRef.current.value,
            medicines: [],
            timings: {
                opening: openingTimeRef.current.value,
                closing: closingTimeRef.current.value
            },
            requests: {
                new: [],
                confirmed: [],
                rejected: []
            },
            verifyFailedReason: '',
        }

        console.log('Details to be updated', userCred);

        db.collection("users").doc(docId).update(userCred)
        .then(() => {
            console.log('success');
            history.replace('/seller/verify');
        })
        .catch(e=>{
            console.log(e.message);
        })
    }
    //USER REGISTERING THE ACCOUNT END
    
    return (
        <>
        <Navbar />
        <div id='register-seller'>
            <div className='container'>
                <Heading as="h2" size="lg">Register</Heading>

                <div className='form-container'>
                    <form autoComplete='off' onSubmit={submitHandler}>

                        <Heading as="h1" size="md" style={{
                            marginBottom: '10px'
                        }}>Basic details</Heading>
                        
                        <div className='input'>
                            <FormControl id="shop-name">
                                <FormLabel>Pharmacy Name</FormLabel>
                                <Input type="text" ref={shopNameRef} />
                            </FormControl>
                        </div>

                        <div className='form-row input'>
                            <div className='col-lg-6'>
                                <FormControl id="owner-name">
                                    <FormLabel>Owner's Full Name</FormLabel>
                                    <Input type="text" ref={ownerRef} />
                                </FormControl>
                            </div>
                            <div className='col-lg-6'>
                                <FormControl id="contact">
                                    <FormLabel>Contact No.</FormLabel>
                                    <Input type="text" ref={contactRef} />
                                </FormControl>
                            </div>
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

                        <div className='form-row input'>
                            <div className='col-lg-5'>
                                <FormControl id="address1">
                                    <FormLabel>Address Line 1</FormLabel>
                                    <Input type="text" ref={address1Ref} />
                                </FormControl>
                            </div>
                            <div className='col-lg-5'>
                                <FormControl id="address2">
                                    <FormLabel>Address Line 2</FormLabel>
                                    <Input type="text" ref={address2Ref} />
                                </FormControl>
                            </div>
                            <div className='col-lg-2'>
                                <FormControl id="pin">
                                    <FormLabel>Pin code</FormLabel>
                                    <Input type="text" ref={pinRef} />
                                </FormControl>
                            </div>
                        </div>

                        <div className='form-row input'>
                            <div className='col-lg-6'>
                                <FormControl id="opening-time">
                                    <FormLabel>Opening Time</FormLabel>
                                    <Select placeholder="Select opening time" ref={openingTimeRef}>
                                        {
                                            timings.map((time, index)=>{
                                                return <option key={time} value={time}>{time}</option>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='col-lg-6'>
                                <FormControl id="closing-time">
                                    <FormLabel>Closing Time</FormLabel>
                                    <Select placeholder="Select closing time" ref={closingTimeRef}>
                                        {
                                            timings.map((time, index)=>{
                                                return <option key={time} value={time}>{time}</option>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div className='input'>
                        <FormControl id="seller">
                            <FormLabel>Seller Type</FormLabel>
                            <Select placeholder="Select option" ref={deliveryRef}>
                                <option value="No Home Delivery">No Home Delivery</option>
                                <option value="Only Home Delivery">Only Home Delivery</option>
                                <option value="Both Home Delivery and in person service">Both Home Delivery and in person service</option>
                            </Select>
                        </FormControl>
                        </div>

                        <Heading as="h1" size="md">Verification</Heading>
                        <div style={{
                            marginBottom: '10px',
                            fontSize: '14px',
                            color: 'gray'
                        }}># Please note that without these documents, we cannot verify your shops. Photos once uploaded could not be changed.</div>

                        <div className='form-row input'>
                            <div className='col-lg-6'>
                                <FormControl id="shop-img">
                                    <FormLabel>Upload your Shop's image</FormLabel>
                                    <input type='file' onChange={handleShopImageChange} className="form-control" id="formFile"/>
                                    <FormHelperText># This image will be displayed to the customers</FormHelperText>
                                </FormControl>
                                {/* {imgUploading1 && <p>{progress1} %</p>} */}
                                {
                                    imgUploading1 && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            padding: '30px'
                                        }}>
                                            <CircularProgress value={progress1} color="teal">
                                                <CircularProgressLabel>{progress1}%</CircularProgressLabel>
                                            </CircularProgress>
                                        </div>
                                    )
                                }

                                {shopImageUrl && <img className='img-fluid' src={shopImageUrl} alt="thumbnail" style={{ width: '500px' }} />}
                            </div>
                            <div className='col-lg-6'>
                                <FormControl id="owner-id-img">
                                    <FormLabel>Upload Shop owner's photo id</FormLabel>
                                    <input type='file' onChange={handleShopIdChange} className="form-control" id="formFile" />
                                    <FormHelperText># This image will be used to verify the owner</FormHelperText>
                                </FormControl>
                                {
                                    imgUploading2 && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            padding: '30px'
                                        }}>
                                            <CircularProgress value={progress2} color="teal">
                                                <CircularProgressLabel>{progress2}%</CircularProgressLabel>
                                            </CircularProgress>
                                        </div>
                                    )
                                }

                                {shopIdUrl && <img className='img-fluid' src={shopIdUrl} alt="thumbnail" style={{ width: '500px' }} />}
                            </div>

                            <div className='col-lg-6'>
                                <FormControl id="shop-certificate-img">
                                    <FormLabel>Shop certificate</FormLabel>
                                    <input type='file' onChange={handleShopCertificateChange} className="form-control" id="formFile" />
                                    <FormHelperText># This image will be used for verification of the Pharmacy</FormHelperText>
                                </FormControl>
                                {
                                    imgUploading3 && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            padding: '30px'
                                        }}>
                                            <CircularProgress value={progress3} color="teal">
                                                <CircularProgressLabel>{progress3}%</CircularProgressLabel>
                                            </CircularProgress>
                                        </div>
                                    )
                                }

                                {shopCerificateUrl && <img className='img-fluid' src={shopCerificateUrl} alt="thumbnail" style={{ width: '500px' }} />}
                            </div>
                        </div>

                        <Button type="submit" mt="8" mb="5" w="100%" colorScheme="teal" variant="solid">
                            Sumbit
                            { loading &&
                                <Spinner ml="3"  color="white" />
                            }
                        </Button>

                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000,
})(RegisterSeller);