import { useRef, useState } from "react";
import {
    Box,
    Center,
    FormControl,
    Input,
    Button,
    Text,
    Image,
    Heading,
    Alert,
    AlertDescription,
    Spinner,
    Select
} from "@chakra-ui/react"
import { Link, useHistory } from "react-router-dom";
import google from "../Assets/google.png";
import facebook from "../Assets/facebook.png";
import { useAuth } from "../../Context/AuthContext";
import { auth, db } from "../../firebase";
import firebase from "firebase/compat/app";
import {  WarningIcon } from "@chakra-ui/icons";

const Signup = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const fNameRef = useRef();
    const lNameRef = useRef();
    const userRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup, currentUser, loginWithGoogle, setUserCred, currentUserCred, setCurrentUserCred } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSignInWithGoogle(e){
        e.preventDefault();
        
        loginWithGoogle()
        .then((authUser) => {
            alert('Success');
            console.log(authUser);
        })
        .catch(e => {
            console.log(e.message)
            setError("Failure, "+e.message);
        })
        .finally(()=>{
        })
    }

    async function handleSignup(e) {
        e.preventDefault();
        console.log("Inside handleSubmit");
        console.log(emailRef.current.value);
    
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }
    
        setLoading(true);
        auth.createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
        .then((authUser) => {
            
            authUser.user.updateProfile({
                displayName: fNameRef.current.value+" "+lNameRef.current.value,
            })

            console.log('here entered --->');

            const userCred = {
                displayName: fNameRef.current.value+" "+lNameRef.current.value,
                email: emailRef.current.value,
                fName: fNameRef.current.value,
                lName: lNameRef.current.value,
                user_uid: authUser.user.uid,
                _id: Date.now(),
                type: userRef.current.value,
                isVerified: false,
                verifyProgress: false,
                userVerified: 'no', //no, cancelled, verified
                verifyFailedReason: '',
                documents: [],
                location: {
                    latitude: '',
                    longitude: ''
                },
                owner: '',
                shopName: '',
                shopAddress: {
                    line1: '',
                    line2: '',
                    pin: ''
                },
                state: '',
                city: '',
                contact: '',
                deliveryType: '',
                medicines: [], //name, status, company, price, id
                timings: {
                    opening: '',
                    closing: ''
                },
                requests: {
                    new: [],
                    confirmed: [],
                    rejected: []
                },

            }
            setUserCred(userCred);
            setCurrentUserCred(userCred);

            db.collection("users").add(userCred) //users --> collection of all the users
            .then(()=>{
                if(userRef.current.value === 'Seller'){
                    history.replace("/register/seller");
                } else if(userRef.current.value === 'Customer') {
                    history.replace('/customer/dashboard');
                }
                setLoading(false);
            })
        })
        .catch(e => {
            console.log(e.message)
            setError("Failure, "+e.message);
            setError(e.message);
        })
        .finally(()=>{
            setLoading(false);
        })
    }

    const userHandler = () => {

    }

    return (
        <Box>
            <Center>

                <Box w={[600, 450]} mt="20" boxShadow="xl" p={[5,10]} pb={[20]}>

                { error &&
                <Alert mb="5" textAlign="center" display="block" status="error">
                <WarningIcon mr="2" w={5} h={5} color="red.500" />
                <AlertDescription>{ error }</AlertDescription>
                </Alert>}

                <Heading textAlign="center" fontSize="4xl" mt="2" mb="6">Create an account</Heading>

                <form onSubmit={ handleSignup }>
                {/* <Button display="flex" w="100%"
                onClick={ handleSignInWithGoogle }>
                    <Image w="7" src={ google } alt="" />
                    <Text ml="3" mr="4">Continue with google</Text>
                </Button>

                <Button display="flex" w="100%" mt="3">
                    <Image w="7" src={ facebook } alt="" />
                    <Text ml="3">Continue with facebook</Text>
                </Button> */}

                {/* <Text textAlign="center" my="6">Or continue with email</Text> */}

                <FormControl id="fName">
                <Input ref={ fNameRef } type="text" placeholder="Enter first name" />
                </FormControl>

                <FormControl id="lName" mt="4">
                <Input ref={ lNameRef } type="text" placeholder="Enter last name" />
                </FormControl>

                <FormControl id="user-type" mt="4">
                    <Select placeholder="User type" ref={userRef}>
                        <option value='Customer'>Customer</option>
                        <option value='Seller'>Seller</option>
                    </Select>
                </FormControl>

                <FormControl id="email" mt="4">
                <Input ref={ emailRef } type="email" placeholder="Enter email" />
                </FormControl>

                <FormControl id="password" mt="4">
                <Input ref={ passwordRef } type="password" placeholder="Enter password" />
                </FormControl>

                <FormControl id="confirm-password" mt="4">
                <Input ref={ passwordConfirmRef } type="password" placeholder="Confirm password" />
                </FormControl>

                <Button type="submit" mt="8" mb="5" w="100%" colorScheme="teal" variant="solid">
                    Create account
                    { loading &&
                        <Spinner ml="3"  color="white" />
                    }
                </Button>

                </form>

                <Text textAlign="center">Already have an account ? <Link to="/login">Login</Link></Text>

                </Box>
            </Center>
        </Box>
    );
}
 
export default Signup;