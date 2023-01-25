import { FormLabel, FormControl} from '@chakra-ui/form-control'
import { VStack } from '@chakra-ui/layout'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Button } from '@chakra-ui/react'
import { useHistory } from "react-router-dom";
import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

const Login = () => {
  const [ show, setShow] = useState(false); 
  const [ email, setEmail] = useState(''); 
  const [ password, setPassword] = useState(''); 

  const {login, error, loading} = useLogin()






  const submitHandler = async(e) => {
    e.preventDefault()

    try {
      await login(email, password)
    } catch (error) {
      console.error(error.message)
    }
 
  }
       // submit login data to backend
// const submitHandler = async(e) => {
// if (!email || !password ) {
//   toast({
//     title: "Ensure all required fields are filled out",
//     status: "warning",
//     duration: 5000,
//     isClosable: true,
//     position: "bottom",
//   });
//   return;
// }

// try {
//   const config = {
//     headers: {
//       "Content-type": "application/json",
//     },
//   };
//   const { data } = await axios.post(
//     'api/user/login',
//     { email, password },
//     config
//   );
//   toast({
//     title: "Login Successful!",
//     status: "success",
//     duration: 5000,
//     isClosable: true,
//     position: "bottom",
//   });
//   localStorage.setItem('userInfo', JSON.stringify(data));
//   history.push('/chat');
//   // location.href = 'api/chat';
// }
// catch(error){
// console.log(error);
// }
//  }
console.log('login page running')
    return (
      <VStack spacing='5px'>
        <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
        placeholder='Enter your email...'
        onChange={(e)=> {setEmail(e.target.value)}}
        value={email}
        />
        </FormControl>
          <FormControl id='login-password '>
          <FormLabel>Password</FormLabel>
          <InputGroup>
          <Input
          placeholder='Enter a password...'
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm'
          onClick={()=> setShow(!show)}
          >
              {show ? 'Hide' : 'Show'}
          </Button>
          </InputRightElement>
          </InputGroup>
            </FormControl>
              <Button 
              colorScheme='blue'
              width='100%'
              mt={15}
              onClick={submitHandler}
              isLoading={loading}
          >Login
          </Button>
          <Button 
              colorScheme='red'
              width='100%'
              mt={15}
              onClick={() => {
                setEmail('johnnyGuest@gmail.com')
                setPassword('howdy1234')
                submitHandler();
              }}
              isLoading={loading}
          >Use Guest Credentials
          </Button>
      </VStack>
    )
  }


export default Login
