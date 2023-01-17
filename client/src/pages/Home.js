import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';
import { useAuthContext } from '../hooks/useAuthContext';


const Home = () => {
  const {user} = useAuthContext(); 
const history = useHistory();

useEffect(() => {
  if (user) {
    history.push('/chat')
  }
}, [user, history])

return (
   <Container maxW='xl'>
    <Box
    w='100%'
    m='40px 0 15px 0'
    borderRadius='lg'
    borderWidth='1px'
    >
      <Text
      fontSize='4x1'
      fontFamily='Work sans'
      color='black'
      >Holla Back
      </Text>
    </Box>
    <Box bg='white'     
    w='100%'
    p={4}
    borderRadius='lg'
    borderWidth='1px'
>
<Tabs variant='soft-rounded' colorScheme='blue'>
  <TabList mb='1em'>
    <Tab width='50%'>Login</Tab>
    <Tab width='50%'>Sign Up</Tab> 
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>
</Box>
   </Container>
  )
}

export default Home
