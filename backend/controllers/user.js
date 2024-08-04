const { StatusCodes } = require('http-status-codes')
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

module.exports = {
    getAuthor,
    getMultipleUsers
}