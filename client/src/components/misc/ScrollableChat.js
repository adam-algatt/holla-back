import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { Box, Tooltip, Avatar, Text } from '@chakra-ui/react'
// import { useChatContext } from '../../hooks/useChatContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { isSameSender, isLastMessage } from '../../config/ChatLogic'

const ScrollableChat = ({ messages }) => {
const { user } = useAuthContext()
// const { messages } = useChatContext(); 

  return (
    <ScrollableFeed>
      {messages && messages.map((m, idx) => (
        <Box display='flex' key={m._id}>
          {(isSameSender(messages, m, idx, user._id)
          || isLastMessage(messages, idx, user._id)
      ) && (
        <Tooltip
          label={m.sender.name}
          placement='bottom-start'
          hasArrow
        >
          <Avatar 
            mt='7px'
            mr={1}
            size='sm'
            cursor='pointer'
            name={m.sender.name}
            src={m.sender.avatar}
          />

        </Tooltip>
      )}
      <Text
      backgroundColor={`${m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`}
      borderRadius='20px'
      padding={2}
      marginTop={1}
      // position='absolute'
      marginLeft={`${m.sender._id === user._id ? '70%' : '1%'}`}
      marginRight={`${m.sender._id === user._id ? '1%' : '30%'}`}
      maxW='75%'
      >
        {m.content}
      </Text>
        </Box>
      ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
