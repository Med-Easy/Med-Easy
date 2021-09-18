import { useEffect, useState } from "react";
import { Box, Center } from "@chakra-ui/layout";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Navbar from "../../Components/Navbar/Navbar";
import Applications from "../../Components/Applications/Applications";
// import EditNgoProfile from "../../Components/EditNgoProfile/EditNgoProfile";
import NgoDashboard from "../../Components/NgoDashboard/NgoDashboar";
import { useAuth } from "../../Context/AuthContext";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { storage, db } from '../../firebase';
import { useHistory } from "react-router-dom";

const NgoPortal = () => {

    const { currentUser } = useAuth();
    const [uniqueId,setUniqueId] = useState("");
    const history = useHistory();

    useEffect(() => {
        db.collection("organisation_details")
        .where("user_uid","==",currentUser.uid)
        .get()
        .then(function(snapshot){
            if(snapshot.docs.length === 0){
                history.push("/register/organisation")
            }
            // setUniqueId(snapshot.docs[0].id);
            // console.log("id in" + snapshot.docs[0].id);
        })
        .catch(function(err){
            console.log(err);
        })
    },[currentUser.uid,uniqueId])

    return (
        <Box mb="16">
            <Navbar/>
            <Center>
            <Box w={[350, 650, 750]} mt="6" boxShadow="xl" p={[5,10]} pb={[20]}>
            <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
                <Tab>
                    Dashboard
                </Tab>
                <Tab>
                    Applications
                </Tab>
            </TabList>
            <TabPanels>

                <TabPanel>
                <NgoDashboard/>
                </TabPanel>

                <TabPanel>
                <Applications/>
                </TabPanel>

            </TabPanels>
            </Tabs>
            </Box>
            </Center>
        </Box>
    );
}
 
export default NgoPortal;