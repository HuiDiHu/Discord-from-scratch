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
    socket.join(socket.user.userid)
    await redisClient.hset(
        `user:${socket.user.userid}`,
        'userid', socket.user.userid,
        'username', socket.user.username,
        'profile', 'GRAGAS',
        'connected', true
    )
    await redisClient.hset(
        `userid:${socket.user.email}`,
        'userid', socket.user.userid,
    )
    //friend rooms id
    const friendIdList = await redisClient.lrange(
        `friends:${socket.user.userid}`, 0, -1
    )
    if (friendIdList.length > 0) {
        socket.to(friendIdList).emit("connected", true, socket.user.userid)
    }
    console.log(socket.user.username, "logged ON")
    const friendList = await getFriendList(friendIdList)
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
    const friendId = await redisClient.hget(
        `user:${tempId}`,
        'userid'
    );
    if (!friendId) {
        cb({ done: false, errMsg: "User doesn't exist!" })
        return;
    }
    const currentFriendList = await redisClient.lrange(
        `friends:${socket.user.userid}`, 0, -1
    )
    //TODO: Add pending here 
    //const currentFriendPendingList = redisClient.lrange(`pending:${friendId}`, 0, -1)
    if (currentFriendList && currentFriendList.indexOf(friendId) !== -1) {
        cb({ done: false, errMsg: "Friend already added!" })
        return;
    }
    //TODO: lpush to pending instead of friends
    await redisClient.lpush(`friends:${socket.user.userid}`, friendId);
    const friend = await redisClient.hgetall( `user:${friendId}` ); friend.connected = friend.connected === 'true' ? true : false;
    socket.to(friend.userid).emit("connected", true, socket.user.userid)
    cb({ done: true, friend })
}

const getFriendList = async (friendIdList) => {
    const friendList = []
    for (let friendId of friendIdList) {
        const friend = await redisClient.hgetall(
            `user:${friendId}`
        )
        friend.connected = friend.connected === 'true' ? true : false;
        friendList.push(friend)
    }
    return friendList;
}

const onDisconnect = async (socket) => {
    if (!socket.user) return
    console.log(socket.user.username, "logged off")
    await redisClient.hset(
        `user:${socket.user.userid}`,
        'connected', false
    )
    //friend room id
    const friendIdList = await redisClient.lrange(`friends:${socket.user.userid}`, 0, -1)
    if (friendIdList.length > 0) {
        socket.to(friendIdList).emit("connected", false, socket.user.userid)
    }
}

const createMessage = async (socket, message) => {
    //TODO: add persistent messages from postgreSQL
    //TODO: store channel member list based on message.from.channel.

    //change message.from.channel to an array of userid of members from message.from.channel
    socket.to(message.from.channel).emit("create_message", message)
}

module.exports = {
    authorizeUser,
    initializeUser,
    addFriend,
    onDisconnect,
    createMessage

}