import React, { useState, useEffect } from 'react';
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react';
import { useChatContext } from '../../hooks/useChatContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogic'
import GroupChatModal from './GroupChatModal'
import { socket } from '../../config/SocketLogic'

const MyChats = ({ fetchagain, setFetchAgain }) => {
  const  [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats, prevchat, setPrevchat } = useChatContext() 
  const { user } = useAuthContext();
  const toast = useToast(); 

  const fetchChats = async() => {

        // format param for JSON stringify
        // let param = {userId: userId};
          try {
            const response = await fetch(`/api/chat`, {
              method: 'GET',
              headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
              },
            }) 
            const json = await response.json(); 
         
            setChats(json)
   
                  }
     catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    // return all of user's chat's on render
 fetchChats();
//  whenever the chats are altered fetch again changes to 
//true and fetchChats() is called again
// eslint-disable-next-line
  }, [fetchagain]);

  const handleSelectedChat = (chat) => {
    // e.preventDefault()
    if (prevchat){
      console.log(prevchat._id);
      socket.emit("leave-room", user._id, prevchat._id)
    } 
    setPrevchat(chat)
    setSelectedChat(chat)
  }

  return (
   
  //  when chat is selected, this box will disappear and make room
  // for active chat screen
   <Box
   display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
   flexDir='column'
   alignItems='center'
   p={{base: 3, md: 2, sm: 1}}
   bg='white'
   w={{ base: '100%', md: '31%'}}
   borderRadius='lg'
   borderWidth='1px'
   >
   <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px", lg: '40px' }}
        fontFamily="Work sans"
        display="flex"
        flexDir='row'
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
<Text
fontFamily='Work sans'
fontSize={{base: '15px', md: '18px' , lg: '32px'}}
>
My Chats
</Text>
<GroupChatModal fetchagain={fetchagain} setFetchAgain={setFetchAgain}>
<Button
display='flex'
paddingX={{base: 'none', md: 1, lg: 2}}
fontSize={{ base: '10px', md: '10px', lg: '12px' }}
rightIcon={<AddIcon />}
>
New Group Chat
</Button>
</GroupChatModal>
   </Box>
   <Box
    pb={3}
        px={3}
        bg='#F8F8F8'
        fontFamily="Work sans"
        display="flex"
        flexDir='column'
        w="100%"
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
   >
  {chats ? (
    <Stack overflowY='scroll'>
   {chats.map((chat) => (
    <Box
      onClick={()=>handleSelectedChat(chat)}
      cursor="pointer"
      bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
      color={selectedChat === chat ? "white" : "black"}
      px={3}
      py={2}
      borderRadius="lg"
      key={`${chat._id}-${chat.name}`}
    >
  {/* check chat logic and below */}
<Text>
  {!chat.isGroupChat ?
    getSender(loggedUser, chat.users) : chat.chatName }
</Text>
{chat.latestMessage && (
  <Text fontSize='xs'>
    <b>{chat.latestMessage.sender.name} : </b>
    {chat.latestMessage.content.length > 50
    ? chat.latestMessage.content.substring(0,51) + "..."
    : chat.latestMessage.content}
  </Text>
)}
    </Box>
  ))}
    </Stack>
    
  ) : (
<ChatLoading/>
  )}
   </Box>
   </Box>
  )
}

export default MyChats
