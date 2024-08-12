const redisClient = require('../redis')
const { StatusCodes } = require('http-status-codes')


const authRateLimiter = (limit, expirationTime) => 
async (req, res, next) => {
    //
    const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    //
    const [response] = await redisClient.multi().incr(ipAddr).expire(ipAddr, expirationTime).exec() //# of auth attemps from a single user
    if (response[1] > limit) {
        res.status(StatusCodes.BAD_REQUEST).json({ loggedIn: false, emailErrMsg: `Slow down! Try again in ${expirationTime} seconds.`, passwordErrMsg: " " })
    } else {
        next()
    }
}

module.exports = authRateLimiter