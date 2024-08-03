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
    const friend = await redisClient.hgetall(`user:${friendId}`); friend.connected = friend.connected === 'true';
    console.log(friend)
    socket.to(friend.userid).emit("connected", true, socket.user.userid)

    cb({ done: true, friend: { ...friend, dm_id } })
}

const getFriendList = async (friendDMIdList) => {
    const friendList = []
    for (let friendDMId of friendDMIdList) {
        const friend = await redisClient.hgetall(
            `user:${friendDMId.split('.')[0]}`
        )
        friend.connected = friend.connected === 'true';
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

const getServerMembersList = async (socket, server_id) => {
    let membersList = (await pool.query(
        "SELECT server_members FROM SERVERS WHERE server_id = $1",
        [server_id]
    )).rows;
    if (membersList.length > 0) {
        membersList = membersList[0].server_members.filter(item => item !== socket.user.userid);
    }
    return membersList;
}

const getMembersList = async (socket, in_dm, in_channel) => {
    let membersList = [];
    if (in_dm !== null && in_dm !== undefined) {
        membersList = (await pool.query(
            "SELECT members FROM DMS WHERE dm_id = $1",
            [Number(in_dm)]
        )).rows;
        if (membersList.length > 0) {
            membersList = (membersList[0].members || []).filter(item => item !== socket.user.userid);
        }
    } else if (in_channel !== null && in_channel !== undefined) {
        const server_id = (await pool.query(
            "SELECT in_server FROM CHANNELS WHERE channel_id = $1",
            [Number(in_channel)]
        )).rows[0].in_server;
        membersList = await getServerMembersList(socket, server_id);
    }
    return membersList;
}

const createMessage = async (socket, tempMessage) => {
    //console.log(tempMessage)
    let message, members;
    if (tempMessage.in_dm !== null) {
        message = (await pool.query(
            "INSERT INTO DM_MESSAGES(created_at, content, posted_by, in_dm) values(to_timestamp($1),$2,$3,$4) RETURNING *",
            [tempMessage.created_at / 1000.0, tempMessage.content, tempMessage.posted_by, tempMessage.in_dm]
        )).rows[0];
    } else if (tempMessage.in_channel !== null) {
        message = (await pool.query(
            "INSERT INTO CHANNEL_MESSAGES(created_at, content, posted_by, in_channel) values(to_timestamp($1),$2,$3,$4) RETURNING *",
            [tempMessage.created_at / 1000.0, tempMessage.content, tempMessage.posted_by, tempMessage.in_channel]
        )).rows[0];
    }
    socket.emit("create_message", message)
    members = await getMembersList(socket, message.in_dm, message.in_channel)
    socket.to(members).emit("create_message", message)
}

const deleteMessage = async (socket, message_id, in_dm, in_channel) => {
    if (in_dm !== null && in_dm !== undefined) {
        await pool.query(
            "DELETE FROM DM_MESSAGES WHERE message_id = $1",
            [message_id]
        )
    } else if (in_channel !== null && in_channel !== undefined) {
        await pool.query(
            "DELETE FROM CHANNEL_MESSAGES WHERE message_id = $1",
            [message_id]
        )        
    }
    const members = await getMembersList(socket, in_dm, in_channel)
    socket.to(members).emit("delete_message", message_id, in_dm, in_channel)
}

const editMessage = async (socket, newMessage, index) => {
    if (newMessage.in_dm !== null && newMessage.in_dm !== undefined) {
        await pool.query(
            "UPDATE DM_MESSAGES SET content = $1, is_edited = $2 WHERE message_id = $3",
            [newMessage.content, newMessage.is_edited, newMessage.message_id]
        )
    } else if (newMessage.in_channel !== null && newMessage.in_channel !== undefined) {
        await pool.query(
            "UPDATE CHANNEL_MESSAGES SET content = $1, is_edited = $2 WHERE message_id = $3",
            [newMessage.content, newMessage.is_edited, newMessage.message_id]
        )
    }
    const members = await getMembersList(socket, newMessage.in_dm, newMessage.in_channel)
    socket.to(members).emit("edit_message", newMessage, index)
}

const createdChannel = async (socket, server_id, channel) => {
    if (server_id !== null && server_id !== undefined && channel !== null && channel !== undefined) {
        const members = await getServerMembersList(socket, server_id);
        socket.to(members).emit("created_channel", server_id, channel);
    }
}

const joinedServer = async (socket, user, server) => {
    if (user && server) {
        const members = await getServerMembersList(socket, server.server_id);
        socket.emit("joined_server", user, {...server, server_members: [user, ...members]});
        socket.to(members).emit("joined_server", user,  {...server, server_members: [user, ...members]});
    }
}

module.exports = {
    authorizeUser,
    initializeUser,
    addFriend,
    onDisconnect,
    createMessage,
    deleteMessage,
    editMessage,
    createdChannel,
    joinedServer
}