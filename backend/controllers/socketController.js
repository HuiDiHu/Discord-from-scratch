
const { getAuthor } = require('../controllers/user');
const { jwtVerify } = require('./jwt/jwtAuth');
const { BadRequestError } = require('../errors')
const redisClient = require('../redis')
const pool = require('../db/connect')

const authorizeUser = (socket, next) => {
    const token = socket.handshake.auth.token;
    jwtVerify(token, process.env.JWT_SECRET)
        .then(decoded => {
            socket.user = { ...decoded };
            next();
        })
        .catch(error => {
            //console.log(error);
            next(new BadRequestError("Not Authorized!"));
        })
};

const alertAllServerMembers = (socket, serverList, loggingOn) => {
    if (!serverList) return;
    const serverMemberIdSet = new Set();
    for (let server of serverList) {
        if (!server.server_members) continue;
        for (let memberId of server.server_members) serverMemberIdSet.add(memberId);
    }
    serverMemberIdSet.delete(socket.user.userid)
    socket.to([...serverMemberIdSet]).emit("connected", loggingOn, socket.user.userid);
}

const getServerList = async (socket, includeIcon) => {
    //server id list;
    const serverIdList = await redisClient.lrange(
        `servers:${socket.user.userid}`, 0, -1
    )
    //server lsit
    const query = `SELECT server_id, date_created, server_name, server_owner, server_members${includeIcon ? ', server_icon' : ''} FROM SERVERS WHERE server_id = ANY ($1)`
    const serverList = (await pool.query(
        query,
        [serverIdList]
    )).rows;
    return serverList
}

const initializeUser = async (socket) => {
    socket.join(socket.user.userid)
    let userProfilePicture = await pool.query(
        "SELECT profilePicture FROM USERS WHERE userid = $1",
        [socket.user.userid]
    )
    if (userProfilePicture.rowCount === 0) {
        userProfilePicture = "";
    } else {
       userProfilePicture = userProfilePicture.rows[0].profilepicture ? userProfilePicture.rows[0].profilepicture.toString('base64') : "";
    }
    await redisClient.hset(
        `user:${socket.user.userid}`,
        'userid', socket.user.userid,
        'username', socket.user.username,
        'profile', userProfilePicture,
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
    socket.emit("connected", true, socket.user.userid)
    if (friendDMIdList.length > 0) {
        socket.to(friendDMIdList.map((item) => item.split('.')[0])).emit("connected", true, socket.user.userid)
    }
    const friendList = await getFriendList(friendDMIdList)
    const serverList = await getServerList(socket, true);
    alertAllServerMembers(socket, serverList, true);
    socket.emit("friends", friendList);
    socket.emit("servers", serverList);

    //console.log(socket.user.username, "logged ON")

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
    const friend = await redisClient.hgetall(`user:${friendId}`);
    friend.connected = friend.connected === 'true';
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
        friendList.push({
            ...friend,
            dm_id: Number(friendDMId.split('.')[1]),
            profile: friend.profile ? Buffer.from(friend.profile, 'base64') : friend.profile
        })
    }
    return friendList;
}

const onDisconnect = async (socket) => {
    if (!socket.user) return
    //console.log(socket.user.username, "logged off")
    await redisClient.hset(
        `user:${socket.user.userid}`,
        'connected', false
    )
    //friend room id
    const friendIdList = (await redisClient.lrange(`friends:${socket.user.userid}`, 0, -1)).map((item) => item.split('.')[0])
    if (friendIdList.length > 0) {
        socket.to(friendIdList).emit("connected", false, socket.user.userid)
    }
    //emit to all server members
    const serverList = await getServerList(socket, false);
    alertAllServerMembers(socket, serverList, false);
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
    const author = await getAuthor(message.posted_by);
    if (author.profile) author.profile = Buffer.from(author.profile, 'base64');

    socket.emit("create_message", message, author)
    members = await getMembersList(socket, message.in_dm, message.in_channel)
    socket.to(members).emit("create_message", message, author)
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

const editMessage = async (socket, newMessage) => {
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
    socket.to(members).emit("edit_message", newMessage)
}

const createdChannel = async (socket, server_id, channel) => {
    if (server_id !== null && server_id !== undefined && channel !== null && channel !== undefined) {
        const members = await getServerMembersList(socket, server_id);
        socket.to(members).emit("created_channel", server_id, channel);
    }
}

const joinedServer = async (socket, user, server) => {
    if (user && server) {
        const [members, server_icon] = await Promise.all([
            getServerMembersList(socket, server.server_id),
            pool.query(
                "SELECT server_icon FROM SERVERS WHERE server_id = $1",
                [Number(server.server_id)]
            )
        ]);
        const user_profile = await redisClient.hget(
            `user:${user.userid}`,
            'profile'
        )
        server.server_members = [user, ...members];
        socket.to(members).emit("joined_server", { ...user, profile: user_profile }, server);
        server.server_icon = server_icon.rows[0].server_icon;
        socket.emit("joined_server", user, server);
    }
}

const leftServer = async (socket, user, server) => {
    if (user && server) {
        const members = await getServerMembersList(socket, server.server_id);
        socket.emit("left_server", user, server);
        socket.to(members).emit("left_server", user, { ...server, server_members: members });
    }
}

const updateServerIcon = async (socket, server_id, arrayBuffer) => {
    if (server_id !== null && server_id !== undefined && arrayBuffer) {
        const members = await getServerMembersList(socket, server_id);
        socket.to(members).emit("update_server_icon", server_id, arrayBuffer);
    }
}

const deleteServer = async (socket, server_id) => {
    if (server_id !== null && server_id !== undefined) {
        const members = await getServerMembersList(socket, server_id);
        for (let memberId of members) {
            await redisClient.lrem(`servers:${memberId}`, 1, server_id)
        }
        socket.to(members).emit("delete_server", server_id);
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
    joinedServer,
    leftServer,
    updateServerIcon,
    deleteServer
}