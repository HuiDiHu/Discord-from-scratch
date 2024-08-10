const { StatusCodes } = require('http-status-codes')
const { UnauthorizedError, BadRequestError, UnauthenticatedError, UnprocessableEntityError } = require('../errors')
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
    return { ...user };
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
    if (!req.session.user || !req.session.user.userid) throw new UnauthenticatedError('You must log in before accessing channels');

    const {
        params: { id: friend_id_dm_id }
    } = req;

    const removed = await redisClient.lrem(`friends:${req.session.user.userid}`, 1, friend_id_dm_id);
    if (removed === 0) throw new BadRequestError(`A friend with an <userid>.<dm_id> of "${friend_id_dm_id}" does not exist within your friendlist.`);
    res.status(StatusCodes.OK).send({ friend_id: friend_id_dm_id.split('.')[0] })
}

const uploadProfilePicture = async (req, res) => {
    const {
        params: { id: userid }
    } = req;

    if (!req.session.user || !req.session.user.userid || !userid) throw new UnauthenticatedError('You must log in before accessing channels');
    if (userid !== req.session.user.userid) throw new UnauthorizedError("You are not authorized to do this action.")
    
    const image = req.file;
    if (!image) throw new UnprocessableEntityError('No image uploaded.');
    const { buffer } = image;

    await Promise.all([
        pool.query(
            "UPDATE USERS SET profilePicture = $2 WHERE userid = $1",
            [userid, buffer]
        ),
        redisClient.hset(
            `user:${userid}`,
            'profile', buffer.toString('base64')
        )
    ]);
    req.session.user.profile = buffer.toString('base64');

    res.status(StatusCodes.OK).send(buffer)
}

module.exports = {
    getAuthor,
    getMultipleUsers,
    deleteFriend,
    uploadProfilePicture
}