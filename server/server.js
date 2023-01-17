const express = require('express'); 
const colors = require('colors');
const app = express(); 
const { chats } = require('./data/data');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors');
dotenv.config();

const ENV = process.env;
const PORT = ENV.PORT || 5007;
connectDB();

app.use('/api', cors());

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

app.listen(PORT, console.log(`app listening on port ${PORT}`)); 