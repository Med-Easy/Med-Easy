import "./MedicineForm.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useToast, Box, Center, Alert, AlertDescription, FormControl, FormLabel, Input, Spinner, Button, Heading, Select, Textarea, Image, Text } from "@chakra-ui/react";
import Navbar from "../../Components/Navbar/Navbar";
import MedicineImg from "../Assets/medicine.jpg"
import { useAuth } from "../../Context/AuthContext";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import {  WarningIcon } from "@chakra-ui/icons";

const MedicineForm = () => {

    const { currentUser } = useAuth();

    const [file, setFile] = useState("");
    const [imgUrl, setImgUrl] = useState(MedicineImg);
    const [secondImgUrl, setSecondImgUrl] = useState(MedicineImg);
    const [status, setStatus] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState(currentUser.email);
    const [contact, setContact] = useState("");
    const [medname, setMedName] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [btnText, setBtnText] = useState("Continue");
    const [uploadBtnText, setUploadBtnText] = useState("Upload");
    const [error,setError] = useState("");

    const toast = useToast();

    function sendConfirmation(){
        toast({
            title: "Detailes submitted successfully.",
            description: "Thank you. The organisation will review",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
    }

    function imgConfirmation(){
        toast({
            title: "Image uploaded successfully.",
            description: "Please fill other details.",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        setStatus(true);
        setUploadBtnText("Uploading...");

        for(let i=0; i<2; i++){
            const img = file[i];
            const storageRef = firebase.storage().ref()
            const fileRef = storageRef.child(img.name)

            if(i === 0){
                await fileRef.put(img)
                setImgUrl(await fileRef.getDownloadURL());
            } 
            if(i === 1){
                await fileRef.put(img)
                setSecondImgUrl(await fileRef.getDownloadURL());
            }
        }
        setStatus(false);
        setUploadBtnText("Uploaded");
        imgConfirmation();
    }

    function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setBtnText("Submitting..");
        const db = firebase.firestore();
        db.collection("medicine-form").add({
            user_uid: currentUser.uid,
            img_one: imgUrl,
            img_second: secondImgUrl,
            name: name,
            email: email,
            contact: contact,
            medicine_name: medname,
            expire_date: date,
            location: location,
            address: address,
            time: firebase.firestore.Timestamp.fromDate(new Date())
        })
        .then(function(res){
            setLoading(false);
            setBtnText("Submitted");
            sendConfirmation();
            console.log(res);
            history.push("/");
        })
        .catch(function(err){
            setError("Failed to submit.");
            console.log("Error " + err);
        })
    }


    return (

        <Box>
            <Navbar/>

            { error &&
            <Alert mb="5" textAlign="center" display="block" status="error">
            <WarningIcon mr="2" w={5} h={5} color="red.500" />
            <AlertDescription>{ error }</AlertDescription>
            </Alert>}

            <Box display="flex" flexWrap="wrap" flexDirection="reverse" mb="10" mx={[1,16]}>

            <Box mr="28">
            <Center>

            <Box w={[350, 650]} mt="16" boxShadow="xl" p={[5,10]} pb={[20]}>

            <Heading mb="3">Fill the details</Heading>

            <form onSubmit={ handleSubmit }>

            <div class="mb-3">
            <label for="formFile" className="form-label">Upload 2 images of medicine and one with expire date</label>
            <input onChange={ (e) => setFile(e.target.files) } multiple className="form-control" type="file" id="formFile"/>
            </div>

            <Button onClick={ handleUpload } mb="5" w="100%" colorScheme="teal" variant="solid">
                { uploadBtnText }
                { status &&
                <Spinner ml="3" colorScheme="gray" />
                }
            </Button>

            <FormControl mt="4" id="name">
            <FormLabel>Your name</FormLabel>
            <Input onChange={ (e) => setName(e.target.value)} name="name" type="text" />
            </FormControl>

            <FormControl mt="4" id="email">
            <FormLabel>Email address</FormLabel>
            <Input defaultValue={ currentUser.email } onChange={ (e) => setEmail(e.target.value)} name="email" type="email" />
            </FormControl>

            <FormControl mt="4" id="phone">
            <FormLabel>Contact number</FormLabel>
            <Input onChange={ (e) => setContact(e.target.value)} name="contact" type="tel" />
            </FormControl>

            <FormControl mt="4" id="medicine-name">
            <FormLabel>Medicine name</FormLabel>
            <Input onChange={ (e) => setMedName(e.target.value)} name="medicine" type="text" />
            </FormControl>

            <FormControl mt="4" id="medicine-name">
            <FormLabel>Expire date of medicine</FormLabel>
            <Input onChange={ (e) => setDate(e.target.value)} name="date" type="date" />
            </FormControl>

            <FormControl mt="4" id="location">
            <FormLabel>Your location</FormLabel>
            <Select onChange={ (e) => setLocation(e.target.value)} name="location" placeholder="Select option">
            <option value="New Delhi">New Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Guwahati">Guwahati</option>
            </Select>
            </FormControl>

            <FormControl mt="4" id="location">
            <FormLabel>Enter your address</FormLabel>
            <Textarea onChange={ (e) => setAddress(e.target.value)} name="address" placeholder="Enter address in detail" />
            </FormControl>

            <Button type="submit" mt="8" mb="5" w="100%" colorScheme="teal" variant="solid">
                { btnText }
                { loading &&
                <Spinner ml="3" colorScheme="gray" />
                }
            </Button>

            </form>
            </Box>

            </Center>
            </Box>

            <Box>
                <Box mt="8rem" ml={[6,32,38]}>

                <Center>
                <Heading fontSize={["3xl","4xl"]} textAlign="center">
                    Enter Medicine Details    
                </Heading>
                </Center>
                
                <Center>    
                <Text mt="5" w="18rem" textAlign="center">
                    Enter your medicine details and we will verify the details
                    and contact you via chat for further process.
                </Text>
                </Center>

                <Center>
                    <Image boxSize={["300px", "400px"]} mt="3" boxShadow="xl" src={ secondImgUrl }></Image>
                </Center>

                <Center>
                    <Image boxSize={["300px", "400px"]} mt="3" boxShadow="xl" src={ imgUrl }></Image>
                </Center>

                <Text mt="3" textAlign="center">Your uploaded images.</Text>
                </Box>
               
            </Box>

            </Box>
                 
        </Box>
    );
}
 
export default MedicineForm;