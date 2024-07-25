const express = require('express');
require('dotenv').config();
require('express-async-errors');
const { Server } = require('socket.io')
const app = express();
const server = require("http").createServer(app);


//security
const cors = require('cors');
const helmet = require('helmet')
const { sessionMiddleware, wrap } = require('./controllers/serverController')

//routes
const authRouter = require('./routes/auth')
const messagesRouter = require('./routes/messages')

//error handler
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

const io = new Server(server, {
    cors: {
        origin: process.env.IS_DEV ? 'http://localhost:5173' : '',
        credentials: true,
        transports: ['polling', 'websocket']
    }
});

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: process.env.IS_DEV ? 'http://localhost:5173' : '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(sessionMiddleware);

app.get('/', async (req, res) => {
    res.send("Hello World!")
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/messages', messagesRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)



const {
    authorizeUser,
    initializeUser,
    addFriend,
    onDisconnect,
    createMessage
} = require('./controllers/socketController');

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);

io.on("connect", socket => {
    initializeUser(socket)
    if (socket.user) {
        socket.on("add_friend", (temp, cb) => { addFriend(socket, temp, cb) });
        socket.on('disconnecting', () => onDisconnect(socket));
        socket.on('create_message', (message) => createMessage(socket, message));
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
