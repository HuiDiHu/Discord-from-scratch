const redisClient = require('../redis')
const RedisStore = require('connect-redis').default
const session = require('express-session')


const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.IS_DEV === false ? "true" : "auto", //in production?
        httpOnly: true,
        expires: 1000 * 60 * 60 * 24 * 7,
        sameSite: process.env.IS_DEV === false ? "none" : "lax"
    }
});

//converts expressMiddleware into socketMiddleware
const wrap = (expressMiddleware) => (socket, next) => expressMiddleware(socket.request, {}, next);

module.exports = { 
    sessionMiddleware,
    wrap
};