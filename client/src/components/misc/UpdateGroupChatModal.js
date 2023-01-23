import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Spinner,
    Button, 
    useDisclosure,
    useToast,
    IconButton,
    FormControl,
    Box, 
    Input
  } from '@chakra-ui/react'
import { useChatContext } from '../../hooks/useChatContext'
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';
import { useAuthContext } from '../../hooks/useAuthContext';
import { ViewIcon } from '@chakra-ui/icons';

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const [groupChatName, setGroupChatName] = useState('')
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const { selectedChat, setSelectedChat } = useChatContext();
    const { user } = useAuthContext(); 
    const toast = useToast();


    const handleRemove = async(userToRemove) => {
      console.log(selectedChat.groupAdmin._id, user._id) 
      if (user._id !== selectedChat.groupAdmin._id){
        toast({
          title: "You need to be a group admin to remove a user!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      try {
        setLoading(true)
        const params = {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        }
        const response = await fetch(`/api/chat/groupremove/`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(params),
        })
        const json = await response.json();
        setSelectedChat(json)
        setFetchAgain(prev => !prev)
        setLoading(false)

      } catch (error) {
        toast({
          title: "Error occured while trying to remove user",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false)
      }
    }

    
    const handleUserSearch = async(userSearchInput) => {
       setSearch(userSearchInput)
       console.log(search)
  
    if (!userSearchInput){
      toast({
            title: "Nothing in Search!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return
        }
          try {
            setLoading(true)
            const response = await fetch(`/api/user?search=${search}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await response.json(); 

    setLoading(false)
    setSearchResult(json); 
    console.log(json)
    
          }
    catch(error) {
    console.log(error)
    }
    }

    
    const handleAddUser = async(userToAdd) => {
      if (selectedChat.users.find(u => u._id === userToAdd._id)) {
        toast({
          title: "User Already in Group",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      if (selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only Group admins add/remove users",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      try {
        setLoading(true)
        const params = {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        }
        const response = await fetch(`/api/chat/groupadd/`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(params),
        })
        const json = await response.json();

        setSelectedChat(json)
        setFetchAgain(prev => !prev)
        setLoading(false)

      } catch (error) {
        toast({
          title: "Error occured while trying to add user",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false)
      }
      setGroupChatName('')
    }

    
    const handleRename = async(req, res) => {
        if (!groupChatName) return

        try {
          setRenameLoading(true)
          let params = {
            chatId: selectedChat._id,
            chatName: groupChatName,
          }

          const response = await fetch(`/api/chat/rename/`, {
            method: 'PUT', 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(params),
          })
          const json = await response.json();

          setSelectedChat(json)
          setFetchAgain(prev => !prev)
          setRenameLoading(false)
        } catch (error) {
          toast({
            title: 'Error renaming chat',
            description: error.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
          })
          setRenameLoading(false)
        }
        setGroupChatName('')

    }
    return (
     <>
      <IconButton display={{ base: 'flex '}} icon={<ViewIcon/>} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize='35px'
          fontFamily='Work sans'
          display='flex'
          justifyContent='center'
          >
         {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display='flex'
          flexDir='column'
          alignItems='center'
         >
         <Box
           w='100%'
           display='flex'
           flexWrap='wrap'
          pb={3}
         >
            {selectedChat.users.map(u => (
                <UserBadgeItem 
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={()=> handleRemove(u)}
                />
            ))}
         </Box>
         <FormControl display='flex' flexDir='column'>
           <Input 
            placeholder='Chat Name'
            mb={3}
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
           />
     
           <Input 
            placeholder='Add user to group'
            mb={1}
            onChange={(e) => handleUserSearch(e.target.value)}
           />
  
         </FormControl> 
         {loading ? (
          <Spinner size='lg'/>
         ) : (
            searchResult?.map(u => (
              <UserListItem 
                key={u._id}
                name={u.name}
                email={u.email}
                avatar={u.avatar}
                handleFunction={()=> handleAddUser(u)}
              />
            ))
         )
         }
          </ModalBody>

          <ModalFooter display='flex' flexDir='row' justifyContent='space-between'>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
            <Button
           variant='solid'
           colorScheme='teal'
           isLoading={renameLoading}
           onClick={handleRename}
           >
            Update
           </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
     </>
  )
}

export default UpdateGroupChatModal
