import { useState, useRef } from "react";
import { Box, Center, FormControl, Input, Button, Text, Image, Heading, Alert, AlertDescription, Spinner } from "@chakra-ui/react"
import { Link, useHistory } from "react-router-dom";
import google from "../Assets/google.png";
import facebook from "../Assets/facebook.png";
import { useAuth } from "../../Context/AuthContext";
import {  WarningIcon } from "@chakra-ui/icons";
import { db } from "../../firebase";

const Login = () => {

    const emailRef = useRef();
    const passwordRef = useRef();

    const { login, loginWithGoogle, setUserCred } = useAuth();
    const [error, setError ] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSignInWithGoogle(e){
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await loginWithGoogle()         
            } catch {
            setError("Failure, minimum 6 characters password is required");
            console.log("error");
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        console.log("Inside handle login");

        setError("");
        setLoading(true);
        login(emailRef.current.value, passwordRef.current.value)
        .then((authUser) => {

            db.collection("users").where("user_uid","==", authUser.user.uid).get()
            .then(function(snapshot){
                console.log(snapshot.docs[0].data());
                
                const userCred = {
                    ...snapshot.docs[0].data()
                }

                const result = snapshot.docs[0].data();

                setUserCred(userCred);
                if(result.type === "Seller"){
                    if(result.isVerified){
                        history.push('/home');
                    } else {
                        history.push('/register/seller')
                    }
                } else if(result.type === 'Customer'){
                    history.push("/home");
                }
                setLoading(false);
            })
            .catch((e)=>{
                setError(e.message);
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


    return (
        <Box>
            <Center>

                <Box w={[600, 450]} mt="20" boxShadow="xl" p={[5,10]} pb={[20]}>

                { error &&
                <Alert mb="5" textAlign="center" display="block" status="error">
                <WarningIcon mr="2" w={5} h={5} color="red.500" />
                <AlertDescription>{ error }</AlertDescription>
                </Alert>}

                <Heading textAlign="center" fontSize="4xl" mt="2" mb="6">Login to continue</Heading>

                <form onSubmit={ handleLogin }>
                <Button display="flex" w="100%" onClick={ handleSignInWithGoogle }>
                    <Image w="7" src={ google } alt="" />
                    <Text ml="3" mr="4">Continue with google</Text>
                </Button>

                <Button display="flex" w="100%" mt="3">
                    <Image w="7" src={ facebook } alt="" />
                    <Text ml="3">Continue with facebook</Text>
                </Button>

                <Text textAlign="center" my="6">Or continue with email</Text>

                <FormControl id="email">
                <Input ref={ emailRef } type="email" placeholder="Enter email" autoComplete="off" />
                </FormControl>

                <FormControl id="password" mt="4">
                <Input ref={ passwordRef } type="password" placeholder="Enter password" />
                </FormControl>

                <Button type="submit" mt="8" mb="5" w="100%" colorScheme="teal" variant="solid">
                    Continue
                    { loading &&
                    <Spinner ml="3"  color="white" />
                    }
                </Button>

                </form>

                <Text textAlign="center">Create an account ? <Link to="/signup">Signup</Link></Text>

                </Box>
            </Center>
        </Box>
    );
}
 
export default Login;