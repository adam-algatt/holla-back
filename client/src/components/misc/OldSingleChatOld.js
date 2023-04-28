import { useState, useEffect } from 'react'
import { useChatContext } from '../../hooks/useChatContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Box, IconButton, Spinner, Text, useToast, FormControl, Input } from '@chakra-ui/react';
import { ArrowBackIcon, SpinnerIcon } from '@chakra-ui/icons';
import { getSender, getSenderProfile } from '../../config/ChatLogic';
import  ProfileModal from './ProfileModal';
import ScrollableChat from './ScrollableChat';
import UpdateGroupChatModal from './UpdateGroupChatModal';
  import socket from '../../config/SocketLogic';  //try with {socket} syntax if not working
import Lottie from "react-lottie";
import animationData from "../../typingAnimation.json"
// server address

let  selectedChatCompare; 

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, notification, setNotification } = useChatContext();
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [currentRoom, setCurrentRoom] = useState('');
  const [socketConnected, setSocketConnected] = useState(false)
  const [lastPong, setLastPong] = useState('')
  const [typing, setTyping] = useState(false)
  const [istyping, setIsTyping] = useState(false)

    const toast = useToast(); 
    //returns other users name as chat title when clicking on a one-to-one 
    // chat
    const getOtherUser = () => selectedChat.users[0].name === user.name ? selectedChat.users[1].name : selectedChat.users[0].name
    
    // Options for Lottie el 
    //   for typing indication
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
   

    const fetchMessages = async () => {
      if (!selectedChat) return
      setLoading(true)
      try {
      
 
        const  response  = await fetch(`/api/message/${selectedChat._id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })

        const json = await response.json(); 

        setMessages(json)
   
        // fetchMessages()
        setLoading(false)
        socket.emit("join-chat", selectedChat._id, user);
        setCurrentRoom(selectedChat._id)
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
    
    const sendMessage = async(e) => {
      // if(e.key !== 'Enter') return
      if (e.key === 'Enter' && newMessage) {
        socket.emit('stop-typing', selectedChat._id)
      
      try {
        
        const params = {
          content: newMessage,
          chatId: selectedChat._id,
        }
        
        setNewMessage('')
      
        const response = await fetch(`/api/message`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(params)
        })
        
        const json = await response.json();
        socket.emit('new-message', json, user._id)
        setMessages(prev => [ ...prev, json  ])
      } catch (error) {
        // toast({
        //   title: 'New Group Chat Created!',
        //   status: 'success',
        //   duration: 5000,
        //   isClosable: true,
        //   position: 'bottom'
        // })
        console.log('failed to send message', '\n', error)
        }
      }
    }

    useEffect(() => {
      socket.emit('setup', user)
      socket.on('connected', () => setSocketConnected(true))
      socket.on('typing',() => setIsTyping(true))
      socket.on('stop-typing',() => setIsTyping(false))
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      fetchMessages()
      selectedChatCompare = selectedChat;
      }, [selectedChat]);
      
      useEffect(() => {
        socket.on("message-recieved", (newMessageRecieved) => {
          if (
            !selectedChatCompare || // if chat is not selected or doesn't match current chat
            selectedChatCompare._id !== newMessageRecieved.chat._id
          ) {
            if (!notification.includes(newMessageRecieved)) {
              setNotification(prev => [newMessageRecieved, ...prev]);
              setFetchAgain(!fetchAgain);
            }
          } else {
            setMessages(prev => [...prev, newMessageRecieved]);
          }
        });
      });

      const handleMessageInput = (e) => {
        setNewMessage(e.target.value); 
        if (!socketConnected) return;
  
        if(!typing){
          setTyping(true);
          console.log(socketConnected, 'inside if(!typing) \n block');
  
          socket.emit('typing', selectedChat._id)
        }
        let prevTime = new Date().getTime();
  
        setTimeout(() => {
          let timeNow = new Date().getTime();
          let gap = timeNow - prevTime;
  
          if(gap >= 3000 && typing) { //if typing inicator has been on for 3 or more seconds stop indicator
            socket.emit('stop-typing', selectedChat._id)
          }
  
        }, 3000)
  
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
          w='100%'
          h='100%'
          >
            <ScrollableChat messages={messages}/>
          </Box>
      )}

      <FormControl 
      onKeyDown={sendMessage} 
      isRequired 
      mt={3}
      >
        {istyping ? (
         <div>
          <Lottie 
            options={defaultOptions}
            width='50%'
            height='35%'
            style={{ marginBottom: 15, marginLeft: 'auto', marginRight: 'auto'}}
          />
          </div>
        ) : (
          <></>
        )}
        <Input
        variant='filled'
        bg='#E0E0E0'
        placeholder='Enter a message...'
        onChange={handleMessageInput}
        value={newMessage}
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
