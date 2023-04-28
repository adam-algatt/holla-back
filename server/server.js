const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require('cors')
const socketIO = require("socket.io")


dotenv.config();
connectDB();
const app = express();

app.use(express.urlencoded({ extended: true})); 
app.use(express.json()); // to accept json data
app.use(cors())
// app.get("/", (req, res) => {
//   res.send("API Running!");
// });

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.blue.bold)
);

const io = socketIO(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected"); //check client side for 'connected'
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
    console.log(`User Joined Room: ${room}`);
  });

  socket.on("leave-room", (userId, room) => {
    socket.leave(room)
    console.log(`user with id: ${userId} left room: ${room}`)
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));  //typing triggers correctly
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));  //issue triggering the stop typing emit

  socket.on("new-message", (newMessageReceived, room) => {  // "new-message emit effectively sent from client sender, but isn't being passed to receiving party"
    console.log('socket.on "new-message" line 82 server.js')
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
        console.log(`sent msg to user in room ${room}`)
        socket.in(room).emit("message-received", newMessageReceived);
      });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
    socket.in(userData._id).emit('leave') // trigger socket disconnect on client side
  });
});
