const { BadRequestError } = require('../errors')
const redisClient = require('../redis')

const authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        next(new BadRequestError("Not Authorized!"))
    } else {
        next()
    }
};

const initializeUser = async (socket) => {
    socket.user = { ...socket.request.session.user };
    await redisClient.hset(
        `user:${socket.user.userid}`,
        'userid', socket.user.userid,
        'profile', 'GRAGAS',
        'username', socket.user.username
    )
    await redisClient.hset(
        `userid:${socket.user.email}`,
        'userid', socket.user.userid,
    )
    const friendList = await redisClient.lrange(
        `friends:${socket.user.userid}`,
        0,
        -1
    )
    socket.emit("friends", friendList)
};

const addFriend = async (socket, temp, cb) => {
    if (temp === socket.user.userid || temp === socket.user.email) {
        cb({ done: false, errMsg: "Cannot friend yourself!" })
        return;
    }
    let tempId = temp;
    if (String(temp).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
        tempId = await redisClient.hget(
            `userid:${temp}`,
            'userid'
        )
    }
    const friendArr = await redisClient.hmget(
        `user:${tempId}`,
        'userid', 'profile', 'username'
    )
    if (!friendArr || !friendArr.length || !friendArr[0]) {
        cb({ done: false, errMsg: "User doesn't exist!" })
        return;
    }
    const currentFriendList = await redisClient.lrange(
        `friends:${socket.user.userid}`,
        0,
        -1
    )
    const friend = {
        userid: friendArr[0],
        profile: friendArr[1],
        username: friendArr[2]
    }
    //TODO: Add pending here 
    //const currentFriendPendingList = redisClient.lrange(`pending:${friendArr[0]}`, 0, -1)
    if (currentFriendList && currentFriendList.indexOf(JSON.stringify(friend)) !== -1) {
        cb({ done: false, errMsg: "Friend already added!" })
        return;
    }
    //TODO: lpush to pending instead of friends
    await redisClient.lpush(`friends:${socket.user.userid}`, JSON.stringify(friend));
    cb({ done: true, friend })
}

module.exports = {
    authorizeUser,
    initializeUser,
    addFriend

}