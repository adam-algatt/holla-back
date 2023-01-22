const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');


const getAllMessages = asyncHandler(async(req, res) => {
console.log('get all messages callled')
    try { 
    // find Message by chatId supplied in params
      const messages = await Message.find({ chat: req.params.chatId })
        .populate('sender', 'name avatar email')
        .populate('chat')
    res.json(messages)
    }
    catch (error) {
        res.status(400)
        throw new Error(error.message);
    }
})


 const sendMessage = asyncHandler(async(req, res) => {
    const { content, chadId } = req.body;
    if (!content) {
        console.log('Please enter a message')
        return res.sendStatus(400)
    }
    if (!chadId) {
        console.log('Please select a chat')
        return res.sendStatus(400)
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
   }

    try {
      let Message = await Message.create(newMessage);

      message = await message.populate('sender', 'name pic')
      message = await message.populate('chat')
      message = await User.populate(message, {
        path: 'chat.users',
        select: 'name avatar email',
      })
      
      await Chat.findByIdAndUpdate(chatId, {latestMessage: message});

      res.json(message);

        
    } catch (error) {
        throw new Error(error.message)
         res.status(400)
    }
 })


module.exports = { getAllMessages, sendMessage };