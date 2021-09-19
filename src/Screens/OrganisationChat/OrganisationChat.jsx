import Navbar from "../../Components/Navbar/Navbar";
import { Box, Text, Center } from "@chakra-ui/react";
import { ChatEngine } from 'react-chat-engine';
import React, { useRef, useState, useEffect } from "react";
import "./OrganisationChat.scss";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { auth } from "../../firebase";

const OrganisationChat = () => {
    const didMountRef = useRef(false)
    const [ loading, setLoading ] = useState(true)
    const { currentUser } = useAuth()
    const history = useHistory()

    async function getFile(url) {
        let response = await fetch(url);
        let data = await response.blob();
        return new File([data], "test.jpg", { type: 'image/jpeg' });
    }

    useEffect(() => {
        if (!didMountRef.current) {
          didMountRef.current = true
    
          if (!currentUser || currentUser === null) {
            history.push("/")
            return
          }
          
          // Get-or-Create should be in a Firebase Function
          axios.get(
            'https://api.chatengine.io/users/me/',
            { headers: { 
              "project-id": 'b3772c81-ead1-467b-aaef-2b130f42ca7e',
              "user-name": currentUser.email,
              "user-secret": currentUser.uid
            }}
          )
    
          .then(() => setLoading(false))
    
          .catch(e => {
            let formdata = new FormData()
            formdata.append('email', currentUser.email)
            formdata.append('username', currentUser.email)
            formdata.append('secret', currentUser.uid)
    
            getFile(currentUser.photoURL)
            .then(avatar => {
              formdata.append('avatar', avatar, avatar.name)
    
              axios.post(
                'https://api.chatengine.io/users/',
                formdata,
                { headers: { "private-key": "08bd857c-88d9-4d6d-b85f-c2873db0de29" }}
              )
              .then(() => setLoading(false))
              .catch(e => console.log('e', e.response))
            })
          })
    
        }
      }, [currentUser, history])


    return (
        <Box className="chat">
            <ChatEngine
            height='100vh'
            projectID='b3772c81-ead1-467b-aaef-2b130f42ca7e'
            userName={ currentUser.email }
            userSecret={ currentUser.uid } 
		    />
        </Box>
        
    );
}
 
export default OrganisationChat;