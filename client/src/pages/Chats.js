import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ChatBox from '../components/misc/ChatBox';
import MyChats from '../components/misc/MyChats';
import SideDrawer from '../components/misc/SideDrawer';
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useAuthContext } from '../hooks/useAuthContext';

const Chats = () => {
  const {user} = useAuthContext()
const [fetchAgain, setFetchAgain] = useState(false);

  console.log('chats component running')
  return (
    <div style={{width: '100%'}}>
 {user && <SideDrawer/>}
 <Box 
 display='flex'
 justifyContent='space-between'
 w='100%'
 h='91.5vh'
 p='10px'>
  {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}  
  {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}

 </Box>
    </div>
  )
}

export default Chats
