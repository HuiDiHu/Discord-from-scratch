const express = require('express');
const { Server } = require('socket.io')
const helmet = require('helmet')
const session = require('express-session')
require('dotenv').config();
require('express-async-errors');

const app = express();
const server = require("http").createServer(app);


//security
const cors = require('cors');

//routes
const authRouter = require('./routes/auth')

//error handler
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: "true"
    }
});

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: process.env.IS_DEV ? 'http://localhost:5173' : '',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        name: "sid",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.IS_DEV === false ? "true" : "auto", //in production?
            httpOnly: true,
            sameSite: process.env.IS_DEV === false ? "none" : "lax"
        }
    })
);

app.get('/', async (req, res) => {
    res.send("Hello World!")
})

app.use('/api/v1/auth', authRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 4000;


io.on("connect", socket => {
    console.log('Socket is connected')
});


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
