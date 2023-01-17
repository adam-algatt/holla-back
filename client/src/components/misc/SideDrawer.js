import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { Button, Tooltip, Box, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerBody, Input, useToast, VStack, StackDivider, Spinner} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
 import UserListItem from './UserListItem';
import { useAuthContext } from '../../hooks/useAuthContext';
import ChatLoading from './ChatLoading';
import ProfileModal from './ProfileModal';
import { useChatContext } from '../../hooks/useChatContext';
const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {logout} = useLogout(); 
  const history = useHistory(); 
  const {user} = useAuthContext(); 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
  } = useChatContext();

  const handleClick = () => {
    logout();
    history.push('/');
  }

  const accessChat = async (userId) => {
    setLoadingChat(true)
    // format param for JSON stringify
    let param = {userId: userId};
      try {
        const response = await fetch(`/api/chat`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(param)
        }) 
        const json = await response.json(); 

        if (!chats.find((c) => c._id === json._id)) setChats(prevChats => ([json, ...prevChats]))
        
     
        setSelectedChat(json)
        setLoadingChat(false)
        // close side drawer
        onClose()
              }
    
    catch (error) {
      console.log(error)
    }
    console.log('accessChat triggered')
  }

  const toast = useToast(); 

  const handleSearch = async(e) => {
    e.preventDefault();
    setLoading(true);
if (!search){
  toast({
        title: "Nothing in Search!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
      try {
const response = await fetch(`/api/user?search=${search}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${user.token}`
  }
})

const json = await response.json(); 

// if(response.ok){
//   disp
// }
setLoading(false)
setSearchResult(json); 
setSearch('')
console.log(json)

      }
catch(error) {
console.log(error)
}

  }

  return (
 <>
  <Box
  d='flex'
  justifyContent='space-between'
  alignItems='center'
  bg='white'
  w='100%'
  p='5px 10px'
  borderWidth='5px'>
    <Tooltip label="Search for users to chat with" 
    hasArrow
    placement='bottom-end'>
    <Button variant='ghost' onClick={onOpen}> 🔎 
    <Text d={{base: 'none', md: 'flex'}} px='4'>
      Search Users
    </Text>
    </Button>
      </Tooltip>
      <Text fontSize='2x1' fontFamily='Work sans'>
      Holla-Back
      </Text>
      <div>
      <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize='2x1' m={1} />
          </MenuButton>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} bgColor='transparent'>
            <Avatar size='sm' 
            cursor='pointer' 
            name={user.name} 
            src={user.avatar}/>
          </MenuButton>
          <MenuList>
          <ProfileModal user={user}>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={handleClick}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
  </Box>
  <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
  <DrawerOverlay/>
    <DrawerContent>
    <DrawerBody>
      <Box d='flex' pb={2}>
        <Input
          placeholder='Search by name or email'
          mr={2}
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
        <Button 
        onClick={handleSearch}
        >
        Go
        </Button>
      </Box>
      {loading ? (
        <ChatLoading/> 
      ) : (
  <VStack
  // divider={<StackDivider borderColor='gray.200' />}

  spacing={2}
  align='stretch'
>
       {searchResult?.map(user => (
        <UserListItem
          key={user._id}
          name={user.name}
          email={user.email}
          avatar={user.avatar}
          handleFunction={() => accessChat(user._id)}
        />
       ))}
       </VStack>
      )
      }
      {loadingChat && <><h4>generating chat...</h4><Spinner ml='auto' d='flex'/></>}
    </DrawerBody>
    </DrawerContent>
  </Drawer>
 </>
  )
}

export default SideDrawer
