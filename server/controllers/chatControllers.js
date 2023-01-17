const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');
const User = require('../models/User');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body; 

    if (!userId) {
        console.log('UserId param not receieved');
        return res.sendStatus(400); 
    }

    // look for one to one chat 
    //containing both the requester's id 
    // and the id submitted in the body
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users:{$elemMatch: {$eq: req.user._id}}},
            {users:{$elemMatch: {$eq: userId}}}
        ],
    })
    // populate users excluding password
    .populate('users', '-password')
        .populate('latestMessage')

        // path is 'latestmessage' from chat model
        // which references the message model
        // in the message model pull: name, avatar, email
        // from the sender field in messages

        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender', 
            select: 'name avatar email',
        });
    
if (isChat.length > 0) {
    res.send(isChat[0]);
} else {
    const chatData = {
        chatName: 'sender',
        isGroupChat: false, 
        users: [req.user._id, userId],
    };
    try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
            'users', 
            '-password'
            )

            res.status(200).send(FullChat); 
    }
    catch (error) {
        res.status(400)
        console.log(error);
    }
}


})


// results is undefined
const fetchChats = asyncHandler(async (req, res) => {
    try {
       
      Chat.find( { users: {$elemMatch :{ $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            chat = await User.populate(results, {
                path: 'latestMessage.sender',
                select: 'name avatar email',
            });
            res.status(200).send(results); 
        })
     
    } 
    catch (error) {
        console.error(error);
    }
})

const createGroupChat = asyncHandler(async (req, res) => { 
    console.log('top line create grp chat')
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({message: 'Fill out required fields.'})
    }
    console.log('92 of gp chat')
// parse stringified obj from frontend
    let users = JSON.parse(req.body.users); 

    if (users.length < 2) {
        return res.status(400).send({message: 'Three or more users are required to create a group chat.'})
    }
// push user creating group chat to users array
    users.push(req.user); 
    console.log('line 98')
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        console.log('line 106')
        const groupChatRes = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            console.log('line 110')
            res.status(200).json(groupChatRes);
    } catch (error) {
        console.log('inside catch')
        console.log(error)
    }
    console.log('got through everything in handler')
})

const renameGroup = asyncHandler(async (req, res) => { 
    const { chatId, chatName } = req.body; 

   const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
    chatName: chatName,
   },
   {
    new: true,
   }
   )
    .populate('users','-password')
    .populate('groupAdmin', '-password')

    if(!updatedChat) {
        res.status(404);
        throw new Error('chat not found')
    } else {
        // const chatReturn = updatedChat;
        res.status(200).json(updatedChat);
    }
    
})

const addToGroup =  asyncHandler(async (req, res) => { 
    const { chatId, userId } = req.body; 

   const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
    $push: { users: userId },
   },
   {
    new: true,
   }
   )
    .populate('users','-password')
    .populate('groupAdmin', '-password')

    if(!updatedChat) {
        res.status(404);
        throw new Error('chat not found')
    } else {
        // const chatReturn = updatedChat;
        res.status(200).json(updatedChat);
    }
})

const removeFromGroup =  asyncHandler(async (req, res) => { 
    const { chatId, userId } = req.body; 

   const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
    $pull: { users: userId },
   },
   {
    new: true,
   }
   )
    .populate('users','-password')
    .populate('groupAdmin', '-password')

    if(!updatedChat) {
        res.status(404);
        throw new Error('chat not found')
    } else {
        // const chatReturn = updatedChat;
        res.status(200).json(updatedChat);
    }
})


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };