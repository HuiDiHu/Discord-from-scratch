const { StatusCodes } = require('http-status-codes')
const pool = require('../db/connect')
const redisClient = require('../redis')
const { UnauthenticatedError, UnprocessableEntityError } = require('../errors')

const createSingleServer = async (req, res) => {
    if (!req.session.user || !req.session.user.userid) throw new UnauthenticatedError('You must log in first before creating a server.');
    const { server_name } = req.body;
    if (!server_name) throw new UnprocessableEntityError('Server name cannot be empty!');
    if (server_name.length > 50) throw new UnprocessableEntityError('Server name too long!');

    const server = (await pool.query(
        "INSERT INTO SERVERS(server_name, server_owner, server_members) values($1,$2,$3) RETURNING *",
        [server_name, req.session.user.userid, [req.session.user.userid]]
    )).rows[0];
    await redisClient.lpush(`servers:${req.session.user.userid}`, server.server_id);

    await pool.query(
        "INSERT INTO CHANNELS(in_server, channel_name) values($1,$2)",
        [server.server_id, "general"]
    )

    res.status(StatusCodes.CREATED).json({ server });
}

const getServerMembers = async (req, res) => {
    if (!req.session.user || !req.session.user.userid) throw new UnauthenticatedError('You must log in first before creating a server.');
    const {
        params: { id: server_id }
    } = req;

    const memberIdList = (await pool.query(
        "SELECT server_members FROM SERVERS WHERE server_id = $1",
        [Number(server_id)]
    )).rows[0].server_members;

    const memberList = [];
    for (let userid of memberIdList) {
        memberList.push(await redisClient.hgetall(`user:${userid}`));
    }

    res.status(StatusCodes.OK).json({ members: memberList })
}

module.exports = {
    createSingleServer,
    getServerMembers
}