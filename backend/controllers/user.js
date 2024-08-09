const { StatusCodes } = require('http-status-codes')
const { UnauthorizedError, BadRequestError } = require('../errors')
const pool = require('../db/connect')
const redisClient = require('../redis')

const getAuthor = async (userid) => {
    let user = (await redisClient.hgetall(`user:${userid}`));
    if (!user.userid) {
        user = {
            userid: userid,
            username: null,
            profile: null
        }
    }
    return { userid: user.userid, username: user.username, profile: user.profile };
}

const getMultipleUsers = async (req, res) => {
    const { useridList } = req.body;
    const userList = [];
    for (const userid of useridList) {
        userList.push(await getAuthor(userid));
    }
    res.status(StatusCodes.OK).json(userList)
}

const deleteFriend = async (req, res) => {
    const {
        params: { id: friend_id_dm_id }
    } = req;

    const removed = await redisClient.lrem(`friends:${req.session.user.userid}`, 1, friend_id_dm_id);
    if (removed === 0) throw new BadRequestError(`A friend with an <userid>.<dm_id> of "${friend_id_dm_id}" does not exist within your friendlist.`);
    res.status(StatusCodes.OK).send({ friend_id: friend_id_dm_id.split('.')[0] })
}

module.exports = {
    getAuthor,
    getMultipleUsers,
    deleteFriend
}