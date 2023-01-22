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


    const handleRemove = async() => {

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

    
    const handleAddUser = async() => {
        
    }

    
    const handleRename = async() => {
        
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
