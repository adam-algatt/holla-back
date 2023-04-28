import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderProfile } from "../../config/ChatLogic";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../typingAnimation.json";

import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useChatContext } from '../../hooks/useChatContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { socket } from '../../config/SocketLogic';  //try with {socket} syntax if not working

let selectedChatCompare; //hoisted socket vars for use within entire component

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const { user } = useAuthContext();


  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, notification, setNotification } =
  useChatContext();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      // socket.emit("leave-room", (user._id, selectedChat))

      setLoading(true);

//added { } around response var 21 mar
        const  response  = await fetch(`/api/message/${selectedChat._id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

      const json  = await response.json(); 

      setMessages(json);
      setLoading(false);
      socket.emit("join-chat", selectedChat._id);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop-typing", selectedChat._id);
      
      try {
        const params = {
          content: newMessage,
          chatId: selectedChat._id,
        };
          console.log(`Chat Id in body is ${selectedChat._id} \n\n on line 98 in SingleChat.js`)
        setNewMessage("");

         const response = await fetch(`/api/message`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(params)
        })

        const json = await response.json();
        socket.emit('new-message', json, selectedChat._id)

        setMessages(prev => [...prev, json]); //check with prev and without if multiple emits at a time
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

 const handleSocketSetup = () => {
    socket.emit("setup", user);
    socket.once("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
 }
  useEffect(() => {
  
    handleSocketSetup()
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
let count = 0
let newMess

const handleMessageEmit = () => {
  socket.on("message-received", (newMessageReceived) => {
    console.log(newMessageReceived)
    if (
      !selectedChatCompare || // if chat is not selected or doesn't match current chat
      selectedChatCompare._id !== newMessageReceived.chat._id
    ) {
      if (!notification.includes(newMessageReceived)) {
        console.log('set notification triggered');
        setNotification(prev => [newMessageReceived, ...prev]);
        // setFetchAgain(!fetchAgain);
      }
    } else {

      setMessages(prev => [...prev, newMessageReceived]);
    
  }
  })
  console.log(messages)
}

useEffect(() => {

  console.log(messages)
}, [messages]);

  useEffect(() => {

    handleMessageEmit()
  }, []);
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

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
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderProfile(user, selectedChat.users)}
                  //make sure the getSenderProfile is set up 
                  //and profile pick is setup in ChatContext

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
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
