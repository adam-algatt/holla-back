import React from 'react'
import { Skeleton, SkeletonCircle, SkeletonText, Stack, Box, Avatar, Text } from '@chakra-ui/react'

const UserListItem = ({ name, email, avatar, handleFunction }) => {
  return (
    <Box
    onClick={handleFunction}
    cursor="pointer"
    bg="#E8E8E8"
    _hover={{
      background: "#38B2AC",
      color: "white",
    }}
    w="100%"
    d="flex"
    alignItems="center"
    color="black"
    px={5}
    py={2}
    mt={2}
    borderRadius="lg"
  >
    <Avatar
      mr={2}
      size="md"
      cursor="pointer"
      name={name}
      src={avatar}
    />
    <Box 
    d='flex'
    flexDir='column'
    alignItems='flex-start'
    justifyContent='space-between'
    >
      <Text>
      {name}
      </Text>
      <Text fontSize="xs">
        <b>{email}</b>
      </Text>
    </Box>
  </Box>
  )
}

export default UserListItem
