import { useRef, useState } from "react";
import { Box, Center, FormControl, Input, Button, Text, Image, Heading, Alert, AlertDescription, Spinner } from "@chakra-ui/react"
import { Link, useHistory } from "react-router-dom";
import google from "../Assets/google.png";
import facebook from "../Assets/facebook.png";
import { useAuth } from "../../Context/AuthContext";
import { auth } from "../../firebase";
import firebase from "firebase/compat/app";
import {  WarningIcon } from "@chakra-ui/icons";

const Signup = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup, currentUser, loginWithGoogle } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSignInWithGoogle(e){
        e.preventDefault();
        try {
            // setError("");
            // setLoading(true);
            await loginWithGoogle()
            history.push("/");
            } catch {
            // setError("Failure, minimum 6 characters password is required");
            console.log("error");
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        console.log("Inside handleSubmit");
        console.log(emailRef.current.value);
    
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match");
        }
    
        try {
          setError("");
          setLoading(true);
          await signup(emailRef.current.value, passwordRef.current.value)
          history.push("/");
        } catch {
          setError("Failure, minimum 6 characters password is required");
        }
    
        setLoading(false);
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
                <Button display="flex" w="100%"
                onClick={ handleSignInWithGoogle }>
                {/* onClick={() => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())} */}
                    <Image w="7" src={ google } alt="" />
                    <Text ml="3" mr="4">Continue with google</Text>
                </Button>

                <Button display="flex" w="100%" mt="3">
                    <Image w="7" src={ facebook } alt="" />
                    <Text ml="3">Continue with facebook</Text>
                </Button>

                <Text textAlign="center" my="6">Or continue with email</Text>

                <FormControl id="email">
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