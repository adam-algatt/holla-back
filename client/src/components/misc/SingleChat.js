import React, { useState } from 'react'
import { useChatContext } from '../../hooks/useChatContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Box, IconButton, Spinner, Text, useToast, FormControl, Input } from '@chakra-ui/react';
import { ArrowBackIcon, SpinnerIcon } from '@chakra-ui/icons';
import { getSender, getSenderProfile } from '../../config/ChatLogic';
import  ProfileModal from './ProfileModal';
import ScrollableChat from './ScrollableChat';
import UpdateGroupChatModal from './UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat } = useChatContext();
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])

    const toast = useToast(); 
    //returns other users name as chat title when clicking on a one-to-one 
    // chat
    const getOtherUser = () => selectedChat.users[0].name === user.name ? selectedChat.users[1].name : selectedChat.users[0].name
    const fetchMessages = async () => {
      if (!selectedChat) return
      
      try {
        setLoading(true)

        const response = fetch(`/api/message/${selectedChat._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })

        setMessages(response)
        setLoading(false)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'failed to load messages',
          status: 'error',
          duration: 5000, 
          isClosable: true,
          position: 'bottom',
        })
      }

    }

    const handleMessageInput = (e) => {
      const { target, value } = e;

      setNewMessage(value); 
    }

    const sendMessage = async() => {

    }

    return (
      <>
      {selectedChat ? (
        <>
        <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
        >
        {/* left arrow to show MyChats component */}
        <IconButton 
        display={{base: 'flex', md: 'none'}}
        icon={<ArrowBackIcon/>}
        onClick={() => setSelectedChat('')}
        />
      
        {(!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderProfile(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
          display='flex'
          flexDir='column'
          justifyContent='flex-end'
          p={3}
          bg='#E8E8E8'
          w='100%'
          h='100%'
          borderRadius='lg'
          overflowY='hidden'
          >
            {loading ? (
            <SpinnerIcon 
              size='xl'
              w={20}
              h={20}
              alignSelf='center'
              margin='auto'
            />
            ) : (
        <Box
          display='flex'
          flexDir='column'
          overflowY='scroll'
          scrollbar-width='none'
          >
            <ScrollableChat messages={messages}/>
          </Box>
      )}

      <FormControl 
      onKeyDown={sendMessage} 
      isRequired 
      mt={3}
      >
        <Input
        variant='filled'
        bg='#E0E0E0'
        placeholder='Enter a message...'
        onChange={handleMessageInput}
        />
      </FormControl>
      </Box>
    </>    
      ) : (
        <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
            <Text fontSize='3x1' pb={3} fontFamily='Work sans'>
              Click on a User to Start Chatting
            </Text>
        </Box>
      )}
    </>
  ); 
};


export default SingleChat
