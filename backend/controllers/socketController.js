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
    //friend rooms ids
    const friendDMIdList = await redisClient.lrange(
        `friends:${socket.user.userid}`, 0, -1
    )
    if (friendDMIdList.length > 0) {
        socket.to(friendDMIdList.map((item) => item.split('.')[0])).emit("connected", true, socket.user.userid)
    }
    const friendList = await getFriendList(friendDMIdList)

    //server id list;
    const serverIdList = await redisClient.lrange(
        `servers:${socket.user.userid}`, 0, -1
    )
    //server lsit
    const serverList = (await pool.query(
        "SELECT * FROM SERVERS WHERE server_id = ANY ($1)",
        [serverIdList]
    )).rows;

    setTimeout(() => { 
        socket.emit("friends", friendList);
        socket.emit("servers", serverList)
        console.log(socket.user.username, "logged ON")
    }, 250)
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

const getDMMembersList = async (socket, in_dm) => {
    let membersQuery;
    if (in_dm !== null) {
        membersQuery = await pool.query(
            "SELECT members FROM DMS WHERE dm_id = $1",
            [in_dm]
        )
    }
    const members = [];
    if (membersQuery.rowCount > 0) {
        members.push(...(membersQuery.rows[0].members.filter(item => item !== socket.user.userid)))
    }
    return members;
}

const createMessage = async (socket, tempMessage) => {
    //TODO: add persistent messages from postgreSQL
    //TODO: store channel member list based on message.from.channel.

    const message = (await pool.query(
        "INSERT INTO DM_MESSAGES(created_at, content, posted_by, in_dm) values(to_timestamp($1),$2,$3,$4) RETURNING *",
        [tempMessage.created_at / 1000.0, tempMessage.content, tempMessage.posted_by, tempMessage.in_dm]
    )).rows[0]
    socket.emit("create_message", message)

    const members = await getDMMembersList(socket, message.in_dm)
    socket.to(members).emit("create_message", message)
}

const deleteMessage = async (socket, message_id, in_dm, in_channel) => {
    if (in_dm !== null) {
        await pool.query(
            'DELETE FROM DM_MESSAGES WHERE message_id = $1',
            [message_id]
        )

        const members = await getDMMembersList(socket, in_dm)
        socket.to(members).emit("delete_message", message_id, in_dm, in_channel)
    } else if (in_channel !== null) { }
}

const editMessage = async (socket, newMessage, index) => {
    if (newMessage.in_dm !== null) {
        await pool.query(
            "UPDATE DM_MESSAGES SET content = $1, is_edited = $2 WHERE message_id = $3",
            [newMessage.content, newMessage.is_edited, newMessage.message_id]
        )

        const members = await getDMMembersList(socket, newMessage.in_dm)
        socket.to(members).emit("edit_message", newMessage, index)
    } else if (newMessage.in_channel !== null) { }
}

module.exports = {
    authorizeUser,
    initializeUser,
    addFriend,
    onDisconnect,
    createMessage,
    deleteMessage,
    editMessage

}