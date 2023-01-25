const express = require('express'); 
const colors = require('colors');
const app = express(); 
const { chats } = require('./data/data');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors');
dotenv.config();
const { Server } = require('socket.io')
const http = require('http');
const { log } = require('console');

const ENV = process.env;
const PORT = ENV.PORT || 5009;
connectDB();

// app.use('/api', cors());
app.use(cors());
// accept json data from frontend
app.use(express.json());

app.get('/', (req, res) => {
res.send('<h4>API is running</h4>')
})


// app.get('/api/chat/:id', (req, res) => {
//     const filteredChat = chats.find(chat => {
//      return chat._id === req.params.id
//     })
//     res.send(filteredChat);
//     })

    app.use('/api/user', userRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/message', messageRoutes);

    const server = app.listen(
      PORT, 
      console.log(`app listening on port ${PORT}`.yellow.bold)); 

// const io = new Server(endpoint, options)
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT'],
    },
    allowEIO3: true
  });

io.on('connect', (socket) => {
  console.log(`connected to ${socket.id}`.blue.bold);


socket.on('setup', (userData) => {
    // creates a single socket for specific user
  socket.join(userData._id);
//   console.log(userData._id)
  socket.emit('connected')
}) 
socket.on('join chat', (room) => {
  socket.join(room)
  console.log(`user joined room: ${room}`);
})
})

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });



