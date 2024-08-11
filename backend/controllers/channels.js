const { StatusCodes } = require('http-status-codes')
const pool = require('../db/connect')
const redisClient = require('../redis')
const { UnauthenticatedError, UnprocessableEntityError } = require('../errors')

const getAllChannelsAndMembersWithServerId = async (req, res) => {
    if (!req.user || !req.user.userid) throw new UnauthenticatedError('You must log in before accessing channels');
    const {
        params: { id: server_id }
    } = req;

    const memberIdList = (await pool.query(
        "SELECT server_members FROM SERVERS WHERE server_id = $1",
        [Number(server_id)]
    )).rows[0].server_members;

    const [channelListQuery, members] = await Promise.all([
        pool.query("SELECT * FROM CHANNELS c WHERE c.in_server = $1", [Number(server_id)]),
        (async () => {
            const memberList = [];
            for (let userid of memberIdList) {
                memberList.push(await redisClient.hgetall(`user:${userid}`));
                memberList[memberList.length - 1].connected = memberList[memberList.length - 1].connected === 'true';
            }            
            return memberList;
        })()
    ]);
    res.status(StatusCodes.OK).json({ members, channelList: channelListQuery.rows });
}

const createSingleChannelWithServerId = async (req, res) => {
    const { server_id, channel_name } = req.body;
    if (!channel_name) throw new UnprocessableEntityError("You cannot create a channel without a channel name.");
    const channel = (await pool.query(
        "INSERT INTO CHANNELS(in_server, channel_name) values($1,$2) RETURNING *",
        [Number(server_id), channel_name]
    )).rows[0];
    
    res.status(StatusCodes.CREATED).json({ channel });
}

module.exports = {
    getAllChannelsAndMembersWithServerId,
    createSingleChannelWithServerId
}