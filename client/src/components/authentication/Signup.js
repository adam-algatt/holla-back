import { FormLabel, FormControl} from '@chakra-ui/form-control'
import { VStack } from '@chakra-ui/layout'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Button, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react';
import { useSignup } from "../../hooks/useSignup"

const Signup = () => {
const [ show, setShow] = useState(false); 
const [ name, setName] = useState(''); 
const [ email, setEmail] = useState(''); 
const [ confirmPassword, setConfirmPassword] = useState(''); 
const [ password, setPassword] = useState(''); 
const [ avatar, setAvatar] = useState('');     
const {signup, error, loading} = useSignup()

const toast = useToast(); 

const postDetails = (pics) => {
  if (pics === undefined) {
    toast({
      title: "Please Select an Image!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }
  // gen new form data containing cloudinary info
  // make a post request to cloudinary with avatar
  // store response containing cloudinary hosted img url to avatar state
  if (pics.type === "image/jpeg" || pics.type === "image/png") {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "holla-back");
    data.append("cloud_name", "duyk43vpx");
    const url = 'https://api.cloudinary.com/v1_1/duyk43vpx/image/upload';
    
    fetch(url, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setAvatar(data.url.toString());
        console.log(data.url.toString());
      })
      .catch((err) => {
        console.log(err);

      });
  } else {
    toast({
      title: "Please Select an Image!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }
};
const submitHandler = async(e) => {
  e.preventDefault()

  await signup(email, password)
}


// submit sign up data to backend
// const submitHandler = async(e) => {
//   if ( !name || !email || !password  ||  !confirmPassword ) {
//     toast({
//       title: "Ensure all required fields are filled out",
//       status: "warning",
//       duration: 5000,
//       isClosable: true,
//       position: "bottom",
//     });
//     return;
//   }
//   if (password !== confirmPassword) {
//     toast({
//       title: "Passwords don't match!",
//       status: "warning",
//       duration: 5000,
//       isClosable: true,
//       position: "bottom",
//     });
//     return;
//   }
//   try {
//     const config = {
//       headers: {
//         "Content-type": "application/json",
//       },
//     };
//     const { data } = await axios.post(
//       'api/user',
//       { name, email, password, avatar },
//       config
//     );
//     toast({
//       title: "Registration Successful!",
//       status: "success",
//       duration: 5000,
//       isClosable: true,
//       position: "bottom",
//     });
//     localStorage.setItem('userInfo', JSON.stringify(data));
// setName('');
// setEmail('');
// setConfirmPassword('');
// setPassword('');
// setAvatar('');
//   }
//   catch(error){
// console.log(error);
//   }
//    }
console.log('signup page running')
  return (
    <VStack spacing='5px'>
      <FormControl id='first-name'>
        <FormLabel>Name</FormLabel>
        <Input
        placeholder='Enter your name...'
        onChange={(e)=> setName(e.target.value)}
        />
        </FormControl>
        <FormControl id='email'>
        <FormLabel>Email</FormLabel>
        <Input
        placeholder='Enter your email...'
        onChange={(e)=> setEmail(e.target.value)}
        />
        </FormControl>
        <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input
        placeholder='Enter a password...'
        type={show ? 'text' : 'password'}
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
            <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
        <Input
        placeholder='Confirm password...'
        type={show ? 'text' : 'password'}
        onChange={(e)=> setConfirmPassword(e.target.value)}
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
            
            <FormControl id='avatar'>
        <FormLabel>Upload an Avatar</FormLabel>
        <Input
        id='choose-file'
        type='file'
        p={1.5}
        accept='image/*'
        onChange={(e) => postDetails(e.target.files[0])}
        />
            </FormControl>
            <Button 
            colorScheme='blue'
            width='100%'
            mt={15}
            onClick={submitHandler}
            isLoading={loading}
        >Sign Up
        </Button>
    </VStack>
  )
}

export default Signup

