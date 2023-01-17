import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure, 
    Button,
    useToast,
    Box,
    FormControl,
    Input
  } from '@chakra-ui/react'
  import { v4 as uuidv4 } from 'uuid';
  import { useChatContext } from '../../hooks/useChatContext';
  import { useAuthContext } from '../../hooks/useAuthContext';
import { Search2Icon } from '@chakra-ui/icons';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';



const GroupChatModal = ({ children }) => {

    const [groupChatName, setGroupChatName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([''])
    const [loading, setLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, setSelectedChat, chats, setChats } = useChatContext() 
   const {user} = useAuthContext(); 
    const toast = useToast(); 
  
 const handleSearch = async (query) => {
setSearch(query)
if (!query) return 

try {
  setLoading(true)
  const response = await fetch(`/api/user?search=${search}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
  // add in error handling if (response.code === good) {
  //   move on
  // } else { return message}

const json = await response.json(); 
setLoading(false)
setSearchResult(json)
console.log(searchResult)
} catch (error) {
  console.log(error)
}
}

 const handleSubmit = async (e) => {
//  const { _id, name, email, password } = user; 
  // setSelectedUsers(prev => [...prev, {_id: _id, name: name, email: email, password: password}]);
  console.log('hello from the new group chat button')
if(!groupChatName || !selectedUsers) {
  toast({
    title: 'fill out all fields',
    status: 'warning',
    duration: 5000,
    isClosable: true,
    position: 'top',
  })
  return
}
try {
  let param = {
    name: groupChatName,
    // ensuring both the inner array and param object are stringified
    users: JSON.stringify(selectedUsers.map((u) => u._id)),
  };
  // console.log(selectedUsers)
  console.log(JSON.stringify(param))
  const response = await fetch(`/api/chat/group`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(param)
    
  })
// add new chat to the front of chat state
setChats(prev => [response, ...prev])
// close modal
onClose()

toast({
  title: 'New Group Chat Created!',
  status: 'success',
  duration: 5000,
  isClosable: true,
  position: 'bottom'
})

} catch (error) {
  console.error(error)
  toast({
    title: 'Failed Group Chat Creation!',
    description: error.response.data,
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'bottom'
  })
}
}

  const handleGroup = async (newGroupUser) => {
    console.log('handleGroup', newGroupUser)
    if (selectedUsers.includes(newGroupUser)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return
    }
    setSelectedUsers(prevSelected => {return [...prevSelected, newGroupUser]})
     }
  const handleDelete = (markedDel) => { 
    setSelectedUsers(prevSelected => {return prevSelected.filter(prev=> prev._id !== markedDel._id)})
}

    return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} 
      onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize='30px'
          fontFamily='Work sans'
          display='flex'
          justifyContent='center'
          >
          Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
         flexDir='column'
          display='flex'
          alignItems='center'
          >
         <FormControl>
            <Input
            placeholder='Chat Name...'
            mb={3}
            onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Input
            placeholder='Add users...'
            mb={3}
            onChange={(e) => handleSearch(e.target.value)}
            />
         </FormControl>
         <Box w='100%' display='flex' flexWrap='wrap'>
         {console.log(selectedUsers)}
        {selectedUsers?.map((u, idx) => (
      
          <UserBadgeItem
          key={`${u.email}-${u._id}-${u.name}`}
          user={u}
          admin={user}
          handleFunction={()=> handleDelete(u)}
     />
        ))}
         </Box>
         {/* selected users */}
         {loading ? (
          <div>Loading...</div>
         ) : (
          searchResult?.slice(0, 8).map((user) => (
            <UserListItem
              key={`${user._id}-${user.email}`} 
              name={user.name}
              email={user.email}
              avatar={user.avatar}
              handleFunction={()=> handleGroup(user)}
            />
          ))
         )}
                 {/* render user search results */}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
             Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
