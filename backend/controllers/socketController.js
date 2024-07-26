const { BadRequestError } = require('../errors')
const redisClient = require('../redis')
const pool = require('../db/connect')

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
    const friendDMIdList = await redisClient.lrange(
        `friends:${socket.user.userid}`, 0, -1
    )
    if (friendDMIdList.length > 0) {
        socket.to(friendDMIdList.map((item) => item.split('.')[0])).emit("connected", true, socket.user.userid)
    }
    console.log(socket.user.username, "logged ON")
    const friendList = await getFriendList(friendDMIdList)
    setTimeout(() => { socket.emit("friends", friendList) }, 69)
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
    const friendIdList = (await redisClient.lrange(
        `friends:${socket.user.userid}`, 0, -1
    )).map((item) => item.split('.')[0])
    //TODO: Add pending here 
    //const friendIdList = redisClient.lrange(`pending:${friendId}`, 0, -1)
    if (friendIdList && friendIdList.indexOf(friendId) !== -1) {
        cb({ done: false, errMsg: "Friend already added!" })
        return;
    }

    const alreadyExistingDM = (await redisClient.lrange(
        `friends:${friendId}`, 0, -1
    )).find(item => item.split('.')[0] === socket.user.userid)

    const dm_id = alreadyExistingDM ? Number(alreadyExistingDM.split('.')[1]) : (await pool.query(
        "INSERT INTO DMS(members) values($1) RETURNING dm_id",
        [[socket.user.userid, friendId]])).rows[0].dm_id;

    //TODO: lpush to pending instead of friends
    await redisClient.lpush(`friends:${socket.user.userid}`, [friendId, dm_id].join('.'));
    const friend = await redisClient.hgetall(`user:${friendId}`); friend.connected = friend.connected === 'true' ? true : false;
    socket.to(friend.userid).emit("connected", true, socket.user.userid)

    cb({ done: true, friend: { ...friend, dm_id } })
}

const getFriendList = async (friendDMIdList) => {
    const friendList = []
    for (let friendDMId of friendDMIdList) {
        const friend = await redisClient.hgetall(
            `user:${friendDMId.split('.')[0]}`
        )
        friend.connected = friend.connected === 'true' ? true : false;
        friendList.push({ ...friend, dm_id: Number(friendDMId.split('.')[1]) })
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
    const friendIdList = (await redisClient.lrange(`friends:${socket.user.userid}`, 0, -1)).map((item) => item.split('.')[0])
    if (friendIdList.length > 0) {
        socket.to(friendIdList).emit("connected", false, socket.user.userid)
    }
}

const createMessage = async (socket, tempMessage) => {
    //TODO: add persistent messages from postgreSQL
    //TODO: store channel member list based on message.from.channel.

    const message = (await pool.query(
        "INSERT INTO DM_MESSAGES(created_at, content, posted_by, in_dm) values($1,$2,$3,$4) RETURNING *",
        [tempMessage.created_at, tempMessage.content, tempMessage.posted_by, tempMessage.in_dm]
    )).rows[0]

    let membersQuery;
    if (message.in_dm !== null) {
        membersQuery = await pool.query(
            "SELECT members FROM DMS WHERE dm_id = $1",
            [message.in_dm]
        )
    }
    const members = [];
    if (membersQuery.rowCount > 0) {
        members.push(...(membersQuery.rows[0].members.filter(item => item !== socket.user.userid)))
    }
    socket.to(members).emit("create_message", message)
}

module.exports = {
    authorizeUser,
    initializeUser,
    addFriend,
    onDisconnect,
    createMessage

}