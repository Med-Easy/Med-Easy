import { useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { Box, Center, FormControl, FormLabel, Input, Textarea, Select, Avatar, Button } from "@chakra-ui/react";
import { useAuth } from "../../Context/AuthContext";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { storage, db } from '../../firebase';


const EditNgoDetails = () => {

    const { currentUser } = useAuth();
    const { id } = useParams();
    const [data, setData] = useState("");
    const history = useHistory();
    
    const nameRef = useRef();
    const ownerRef = useRef();
    // const displayPicRef = useRef();
    const websiteRef = useRef();
    const descriptionRef = useRef();
    const emailRef = useRef();
    const contactRef = useRef();
    const locationRef = useRef();
    const addressRef = useRef();

    const [name, setName] = useState("");
    const [owner, setOwner] = useState("");
    const [displayPic, setDisplayPic] = useState("");
    let profilePic = data.profile_pic;
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        db.collection("organisation_details")
        .doc(id)
        .get()
        .then(function(snapshot){
            setData(snapshot.data());
            console.log(snapshot.data());
            setName(snapshot.data.length().name);
            setOwner(snapshot.data().owner_name);
            setDisplayPic(snapshot.data().profile_pic);
            setWebsiteUrl(snapshot.data().website);
            setDescription(snapshot.data().description);
            setContact(snapshot.data().contact);
            setLocation(snapshot.data().location);
            setAddress(snapshot.data().address);
        })
        .catch(function(err){
            console.log(err);
        })
    },[])

    function handleProfilePic(e){
        if (e.target.files[0]) {
            // setUploadStatus2("Uploading...");

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
                    console.log("fetching...");
                    // setUploadStatus2("Fetching url...");
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
                        profilePic = url;
                        console.log(profilePic);
                        setDisplayPic(url);
                        // setCertificateUrl(url);
                        // setUploadStatus2("Uploaded successfully");
                        // setUrlStatus2(true);
                        // db.collection("organisation_details")
                        // .doc(id)
                        // .update({
                        //     profile_pic: displayPic,
                        // })
                    });
                }
            );
        }
    }


    function handleSubmit(e){
        e.preventDefault();

        console.log(websiteUrl);
        console.log(displayPic);
        console.log(name);
        console.log(owner);
        console.log(description);
        console.log(email);
        console.log(contact);
        console.log(location);
        console.log(address);
        console.log("All values end ");

        db.collection("organisation_details")
        .doc(id)
        .update({
            website: websiteRef.current.value,
            profile_pic: displayPic,
            name: nameRef.current.value,
            owner_name: ownerRef.current.value,
            description: descriptionRef.current.value,
            email: emailRef.current.value,
            contact: contactRef.current.value,
            location: locationRef.current.value,
            address: addressRef.current.value,
            time: firebase.firestore.Timestamp.fromDate(new Date())
        })
        .then(function(res){
            console.log(res);
            console.log("updated");
            history.push("/organisation/dashboard");
        })
        .catch(function(err){
            console.log(err);
        })
    }


    return (
        <Box mb="16">
            <Navbar/>
            <Center>

            { data &&
            <Box>  
            <form onSubmit={ handleSubmit }>
            <Box display="flex" flexWrap="wrap" justifyContent="evenly" mb="5" mt="5">

                <Box mr="10">

                <Center>
                <Avatar size="2xl" name="Segun Adebayo" src={ data.profile_pic } />
                </Center>

                <FormControl mt="12" id="name" w={[150,250]}>
                <input onChange={ handleProfilePic } w={[200]} className="form-control" type="file" id="formFile"/>
                </FormControl>  
                </Box>

                <Box>
                <FormControl id="name" w={[250,340]}>
                <FormLabel>Organisation name</FormLabel>
                <Input ref={ nameRef } defaultValue={ data.name } type="text" />
                </FormControl>  

                <FormControl mt="3" id="name" w={[250,340]}>
                <FormLabel>Owner name</FormLabel>
                <Input ref={ ownerRef } defaultValue={ data.owner_name } type="text" />
                </FormControl> 

                <FormControl mt="3" id="email">
                <FormLabel>Email address</FormLabel>
                <Input ref={ emailRef } defaultValue={ data.email } type="email" />
                </FormControl>   
                </Box>

            </Box>

            <hr />

            <Box mt="8">

                <FormControl id="email">
                <FormLabel>Description</FormLabel>
                <Textarea ref={ descriptionRef } defaultValue={ data.description } placeholder="Here is a sample placeholder" />
                </FormControl>  

                <FormControl mt="3" id="contact">
                <FormLabel>Contact No.</FormLabel>
                <Input ref={ contactRef } defaultValue={ data.contact } type="number" />
                </FormControl>

                <FormControl mt="3" id="website">
                <FormLabel>Website URL</FormLabel>
                <Input ref={ websiteRef } defaultValue={ data.website } type="text" />
                </FormControl>

                <FormControl mt="3" id="email">
                <FormLabel>Description</FormLabel>
                <Select ref={ locationRef } defaultValue={ data.location } name="location" placeholder="Select option" required>
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
                </FormControl> 

                <FormControl mt="3" id="email">
                <FormLabel>Address</FormLabel>
                <Textarea ref={ addressRef } defaultValue={ data.address } placeholder="Here is a sample placeholder" />
                </FormControl>  

            </Box>

            <Button type="submit" w="100%" mt="4" colorScheme="teal">Confirm Changes</Button>
            </form>
            </Box>}

            </Center>
        </Box>
    );
}
 
export default EditNgoDetails;