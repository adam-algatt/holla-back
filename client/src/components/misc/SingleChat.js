import React from 'react'
import { useChatContext } from '../../hooks/useChatContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderProfile } from '../../config/ChatLogic';
import  ProfileModal from './ProfileModal';

const SingleChat = () => {
    const { selectedChat, setSelectedChat } = useChatContext();
    const { user } = useAuthContext()
    //returns other users name as chat title when clicking on a one-to-one 
    // chat
    const getOtherUser = () => selectedChat.users[0].name === user.name ? selectedChat.users[1].name : selectedChat.users[0].name
    
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
                  {/* <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  /> */}
                </>
              ))}
          </Text>
          </>
      ) : (
        <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
            <Text fontSize='3x1' pb={3} fontFamily='Work sans'>
              Click on a User to Start Chatting
            </Text>
        </Box>

      )}
    </>
  )
}

export default SingleChat
