const express = require('express');
const colors = require('colors');
//changed line below to let 3/20
let app = express();
//file below 3/20
const { initializeRoutes } = require("./routes");
// const {
//   chats
// } = require('./data/data');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors');
dotenv.config();
const http = require('http');
const {
  log
} = require('console');
const socketio = require('socket.io')
const ENV = process.env;
const PORT = ENV.PORT || 13340;
connectDB();

// app.use('/api', cors());
app.use(cors());
// accept json data from frontend
app.use(express.json());
/*added 3/20*/
app.use(express.urlencodedo({ extended: true})); 
/*added 3/20*/
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

/* const server = app.listen(
      PORT, 
      console.log(`app listening on port ${PORT}`.yellow.bold)); 
*/

const server = app.listen(
  PORT,
  console.log(`Server running at port: http://localhost:${PORT}`)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
 
  socket.on("setup", (userData) => {
    
    if(userData === null || userData === undefined) return
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => {
    console.log('typing emitted from client room:', room);
    socket.in(room).emit("typing")});

  socket.on("stop-typing", (room) => {
    console.log('stop-typing emitted from client room:', room);
    socket.in(room).emit("stop-typing")
  })

  socket.on("new-message", (newMessageRecieved, sender) => {
    let chatUsers= [...newMessageRecieved.chat.users]; 
    var chatRecipients = chatUsers.filter(user => user._id !== sender); //
    if (!chatUsers) return console.log("chat.users not defined");
      // chatRecipients.forEach(recipient => {
        // console.log(recipient._id)
        // socket.in(recipient._id).emit("message-recieved", newMessageRecieved)
        socket.in(newMessageRecieved.chat._id).emit("message-recieved", newMessageRecieved)

      // })
  });
  socket.on("disconnect", (reason) => {
    console.log("USER DISCONNECTED", socket.id, '\n\n', 'socket connected: ', socket.connected);
    socket.emit('leave')
    console.log(reason)
    if (reason === "io server disconnect") socket.connect()
    // socket.leave(userData._id);
  // socket.off("setup", () => {
  //   socket.on('disconnect', () => {
  //   console.log("USER DISCONNECTED");
  //   // socket.leave(userData._id);
   });
});
