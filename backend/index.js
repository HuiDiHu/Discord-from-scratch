const express = require('express');
require('dotenv').config();
require('express-async-errors');
const { Server } = require('socket.io')
const app = express();
const server = require("http").createServer(app);


//security
const cors = require('cors');
const helmet = require('helmet')

//authenticate user
const authenticateUser = require('./middleware/authentication');

//routes
const authRouter = require('./routes/auth')
const messagesRouter = require('./routes/messages')
const serversRouter = require('./routes/servers')
const channelsRouter = require('./routes/channels')
const userRouter = require('./routes/user')

//error handler
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

const io = new Server(server, {
    cors: {
        origin: process.env.IS_DEV === 'true' ? process.env.CLIENT_DEV_URL : process.env.CLIENT_URL,
        credentials: true,
        transports: ['polling', 'websocket']
    }
});

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: process.env.IS_DEV === 'true' ? process.env.CLIENT_DEV_URL : process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', async (req, res) => {
    res.send("Hello World!")
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/messages', authenticateUser, messagesRouter);
app.use('/api/v1/servers', authenticateUser, serversRouter);
app.use('/api/v1/channels', authenticateUser, channelsRouter);
app.use('/api/v1/user', authenticateUser, userRouter);

//reverse proxy
app.set("trust proxy", 1);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)



const {
    authorizeUser,
    initializeUser,
    addFriend,
    onDisconnect,
    createMessage, deleteMessage, editMessage,
    createdChannel,
    joinedServer, leftServer,
    updateServerIcon,
    deleteServer
} = require('./controllers/socketController');


io.use(authorizeUser);

io.on("connect", socket => {
    initializeUser(socket)
    if (socket.user) {
        socket.on("add_friend", (temp, cb) => { addFriend(socket, temp, cb) });
        socket.on('disconnecting', () => onDisconnect(socket));
        socket.on('create_message', (message) => createMessage(socket, message));
        socket.on('delete_message', (message_id, in_dm, in_channel) => deleteMessage(socket, message_id, in_dm, in_channel))
        socket.on('edit_message', (newMessage) => editMessage(socket, newMessage))
        socket.on('created_channel', (server_id, channel) => createdChannel(socket, Number(server_id), channel))
        socket.on('joined_server', (targetUser, targetServer) => joinedServer(socket, targetUser, targetServer))
        socket.on('left_server', (targetUser, targetServer) => leftServer(socket, targetUser, targetServer))
        socket.on('update_server_icon', (server_id, arrayBuffer) => updateServerIcon(socket, server_id, arrayBuffer))
        socket.on('delete_server', (server_id) => deleteServer(socket, server_id))
    }
});

const port = process.env.PORT || 4000;

const start = async () => {
    try {
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });
    } catch (error) {
        console.log(error)
    }
}

start();
