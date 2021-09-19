import { useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { Box, Center, FormControl, FormLabel, Input, Select, Textarea, Button, Heading, Text, Link, Spinner, useToast } from "@chakra-ui/react";
import { useAuth } from "../../Context/AuthContext";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { storage, db } from '../../firebase';

const RegisterNgo = () => {

    const { currentUser } = useAuth();
    const history = useHistory();

    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [description, setDescription] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [email, setEmail] = useState(currentUser.email);
    const [contact, setContact] = useState("");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [idUrl, setIdUrl] = useState("");
    const [certificateUrl, setCertificateUrl] = useState("");
    const [reportUrl, setReportUrl] = useState("");
    const [verified, setVerified] = useState(false);

    const [uploadStatus1, setUploadStatus1] = useState("* Required");
    const [uploadStatus2, setUploadStatus2] = useState("* Required");
    const [uploadStatus3, setUploadStatus3] = useState("* Required");
    const[urlStatus1, setUrlStatus1] = useState(false);
    const[urlStatus2, setUrlStatus2] = useState(false);
    const[urlStatus3, setUrlStatus3] = useState(false);

    const[btnText, setBtnText] = useState("Continue");
    const[loading, setLoading] = useState(false);

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

    function handleIdChange(e){
        if (e.target.files[0]) {
            setUploadStatus1("Uploading...");

            // setFile(e.target.files[0]);
            let reader = new FileReader();
            reader.onload = (e) => {
            };
            reader.readAsDataURL(e.target.files[0]);

            let val=e.target.files[0];
            let imageName = Date.now();
            const uploadTask = storage.ref(`ngo-documents/${currentUser.email}/${imageName}`).put(val);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    setUploadStatus1("Fetching url...");
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref()
                    .child(`ngo-documents/${currentUser.email}/`+imageName)
                    .getDownloadURL()
                    .then(url => {
                        console.log('this is the image url', url);
                        setIdUrl(url);
                        setUploadStatus1("Uploaded successfully");
                        setUrlStatus1(true);
                    });
                }
            );
        }
    }

    function handleCertificateChange(e){
        if (e.target.files[0]) {
            setUploadStatus2("Uploading...");

            let reader = new FileReader();
            reader.onload = (e) => {
            };
            reader.readAsDataURL(e.target.files[0]);

            let val=e.target.files[0];
            let imageName = Date.now();
            const uploadTask = storage.ref(`ngo-documents/${currentUser.email}/${imageName}`).put(val);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    setUploadStatus2("Fetching url...");
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref()
                    .child(`ngo-documents/${currentUser.email}/`+imageName)
                    .getDownloadURL()
                    .then(url => {
                        console.log('this is the image url', url);
                        setCertificateUrl(url);
                        setUploadStatus2("Uploaded successfully");
                        setUrlStatus2(true);
                    });
                }
            );
        }
    }


    function handleReportChange(e){
        if (e.target.files[0]) {
            setUploadStatus3("Uploading...");

            let reader = new FileReader();
            reader.onload = (e) => {
            };
            reader.readAsDataURL(e.target.files[0]);

            let val=e.target.files[0];
            let imageName = Date.now();
            const uploadTask = storage.ref(`ngo-documents/${currentUser.email}/${imageName}`).put(val);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    setUploadStatus3("Fetching url...");
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref()
                    .child(`ngo-documents/${currentUser.email}/`+imageName)
                    .getDownloadURL()
                    .then(url => {
                        console.log('this is the image url', url);
                        setReportUrl(url);
                        setUploadStatus3("Uploaded successfully");
                        setUrlStatus3(true);
                    });
                }
            );
        }  
    }

    // To store data to firestore
    function handleSubmit(e){
        e.preventDefault();
        
        setBtnText("Submitting...")
        setLoading(true);
        db.collection("organisation_details").add({
            user_uid: currentUser.uid,
            profile_pic: profilePic,
            website: websiteUrl,
            name: name,
            description: description,
            owner_name: ownerName,
            email: email,
            contact: contact,
            location: location,
            address: address,
            document_url: {
                id: idUrl,
                certificate: certificateUrl,
                report: reportUrl
            },
            verified: verified,
            time: firebase.firestore.Timestamp.fromDate(new Date())
        })
        .then(function(res){
            console.log(res);
            setLoading(false);
            setBtnText("Submitted");
            sendConfirmation();
            history.push("/home");
        })
        .catch(function(err){
            console.log.log("Error " + err);
        })
    }



    return (  
        <Box>
            <Navbar/>
            <Heading color="teal" textAlign="center">Register your organisation !</Heading>
            <Center>
                <Box w={[350, 650]} mt="16" boxShadow="xl" p={[5,10]} pb={[20]}>

                    <form onSubmit={ handleSubmit }>

                    <Heading fontSize="2xl">Basic Details</Heading>

                    <FormControl mt="4" id="name">
                    <FormLabel>Organisation name</FormLabel>
                    <Input onChange={ (e) => setName(e.target.value)} name="name" type="text" required />
                    <Text color="teal" display="inline">* Required</Text>
                    </FormControl>

                    <FormControl mt="4" id="description">
                    <FormLabel>Description of your organisation</FormLabel>
                    <Input onChange={ (e) => setDescription(e.target.value)} name="description" type="text" required />
                    <Text color="teal" display="inline">* Required</Text>
                    </FormControl>

                    <FormControl mt="4" id="owner-name">
                    <FormLabel>Owner names</FormLabel>
                    <Input onChange={ (e) => setOwnerName(e.target.value)} name="owner-name" type="text" required />
                    <Text color="teal" display="inline">* Required</Text>
                    </FormControl>

                    <FormControl mt="4" id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input defaultValue={ currentUser.email } onChange={ (e) => setEmail(e.target.value)} name="email" type="email" required />
                    <Text color="teal" display="inline">* Required</Text>
                    </FormControl>

                    <FormControl mt="4" id="phone">
                    <FormLabel>Contact number</FormLabel>
                    <Input onChange={ (e) => setContact(e.target.value)} name="contact" type="tel" required />
                    <Text color="teal" display="inline">* Required</Text>
                    </FormControl>

                    <FormControl mt="4" id="location">
                    <FormLabel>Your location</FormLabel>
                    <Select onChange={ (e) => setLocation(e.target.value)} name="location" placeholder="Select option" required>
                    <option value="Angul">Angul</option>
                    <option value="Balangir">Balangir</option>
                    <option value="Balasore">Balasore</option>
                    <option value="Bargarh">Bargarh</option>
                    <option value="Bhadrak">Bhadrak</option>
                    <option value="Boudh">Boudh</option>
                    <option value="Cuttack">Cuttack</option>
                    <option value="Deogarh">Deogarh</option>
                    <option value="Dhenkanal">Dhenkanal</option>
                    <option value="Gajapati">Gajapati</option>
                    <option value="Ganjam">Ganjam</option>
                    <option value="Jagatsinghapur">Jagatsinghapur</option>
                    <option value="Jajpur">Jajpur</option>
                    <option value="Jharsuguda">Jharsuguda</option>
                    <option value="Kalahandi">Kalahandi</option>
                    <option value="Kandhamal">Kandhamal</option>
                    <option value="Kendrapara">Kendrapara</option>
                    <option value="Kendujhar">Kendujhar</option>
                    <option value="Khordha">Khordha</option>
                    <option value="Koraput">Koraput</option>
                    <option value="Malkangiri">Malkangiri</option>
                    <option value="Mayurbhanj">Mayurbhanj</option>
                    <option value="Nabarangpur">Nabarangpur</option>
                    <option value="Nayagarh">Nayagarh</option>
                    <option value="Nuapada">Nuapada</option>
                    <option value="Puri">Puri</option>
                    <option value="Rayagada">Rayagada</option>
                    <option value="Sambalpur">Sambalpur</option>
                    <option value="Sonepur">Sonepur</option>
                    <option value="Sundargarh">Sundargarh</option>
                    </Select>
                    <Text color="teal" display="inline">* Required</Text>
                    </FormControl>

                    <FormControl mt="4" id="location">
                    <FormLabel>Enter your address</FormLabel>
                    <Textarea onChange={ (e) => setAddress(e.target.value)} name="address" placeholder="Enter address in detail" required/>
                    <Text color="teal" display="inline">* Required</Text>
                    </FormControl>


                    <Heading mt="10" mb="5" fontSize="2xl">Documents for verification</Heading>

                    <div mt="3">
                    <label for="formFile" className="form-label">Upload owners photo ID</label>
                    <input onChange={ handleIdChange } className="form-control" type="file" id="formFile" required/>
                    </div>
                    <Text color="teal" display="inline">{ uploadStatus1 }</Text>
                    { urlStatus1 &&
                    <Link ml="3" color="blue" target="_blank" href={ idUrl }>View</Link>
                    }
              
                    <div class="mt-3">
                    <label for="formFile" className="form-label">Upload organisation registration certificate</label>
                    <input onChange={ handleCertificateChange } className="form-control" type="file" id="formFile" required/>
                    </div>
                    <Text color="teal" display="inline">{ uploadStatus2 }</Text>
                    { urlStatus2 &&
                    <Link ml="3" color="blue" target="_blank" href={ certificateUrl }>View</Link>
                    }
            
                    <div class="mt-3">
                    <label for="formFile" className="form-label">Upload annual report.</label>
                    <input onChange={ handleReportChange } className="form-control" type="file" id="formFile" required/>
                    </div>
                    <Text color="teal" display="inline">{ uploadStatus3 }</Text>
                    { urlStatus3 &&
                    <Link ml="3" color="blue" target="_blank" href={ reportUrl }>View</Link>
                    }

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
    );
}
 
export default RegisterNgo;