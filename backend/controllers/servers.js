const { StatusCodes } = require('http-status-codes')
const pool = require('../db/connect')
const redisClient = require('../redis')
const { UnauthenticatedError, UnprocessableEntityError, BadRequestError, UnauthorizedError, NotFoundError } = require('../errors')

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

    let memberIdList = (await pool.query(
        "SELECT server_members FROM SERVERS WHERE server_id = $1",
        [Number(server_id)]
    )).rows;
    if (memberIdList.length === 0) throw new NotFoundError("Server not found.");
    memberIdList = memberIdList[0].server_members;

    const memberList = [];
    for (let userid of memberIdList) {
        memberList.push(await redisClient.hgetall(`user:${userid}`));
        memberList[memberList.length - 1].connected = memberList[memberList.length - 1].connected === 'true';
    }
    res.status(StatusCodes.OK).json({ members: memberList })
}

function makeToken(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const ONE_DAY = 24 * 60 * 60 * 1000;

const generateInviteToken = async (req, res) => {
    const {
        params: { id: server_id }
    } = req;
    let token;
    do {
        let tempToken = makeToken(6);
        const tokenQuery = (await pool.query(
            "SELECT created_at FROM INVITE_TOKENS t WHERE t.token = $1",
            [tempToken]
        )).rows;
        if (tokenQuery.length === 0) {
            token = tempToken;
        } else {
            const created_at = tokenQuery[0].created_at;
            if (created_at && (new Date() - new Date(created_at)) > ONE_DAY) {
                await pool.query(
                    "DELETE FROM INVITE_TOKENS WHERE token = $1",
                    [tempToken]
                )
                token = tempToken;
            }
        }
    } while (!token)
    await pool.query(
        "INSERT INTO INVITE_TOKENS(token, references_server) VALUES($1,$2)",
        [token, Number(server_id)]
    )
    res.status(StatusCodes.CREATED).json({ token });
}

const joinServer = async (req, res) => {
    if (!req.session.user || !req.session.user.userid) throw new UnauthenticatedError('You must log in before accessing channels');
    const {
        params: { id: token }
    } = req;
    
    const tokenQuery = (await pool.query(
        "SELECT * FROM INVITE_TOKENS WHERE token = $1",
        [token]
    )).rows;
    if (tokenQuery.length === 0) throw new BadRequestError("Invalid invite token.");

    const created_at = tokenQuery[0].created_at;
    if ((new Date() - new Date(created_at)) > ONE_DAY) {
        await pool.query(
            "DELETE FROM INVITE_TOKENS WHERE token = $1",
            [token]
        )
        throw new BadRequestError("This invitation has expired.")
    }
    //check if user is already a member
    let server = (await pool.query(
        "SELECT * FROM SERVERS WHERE server_id = $1",
        [tokenQuery[0].references_server]
    )).rows;
    if (server.length === 0) throw new NotFoundError("Server not found.")
    server = server[0];

    if (server.server_members.find(item => item === req.session.user.userid)) throw new UnauthorizedError("You are already a member of this server.");

    await Promise.all([
        pool.query(
            `UPDATE SERVERS SET server_members = ARRAY_APPEND(server_members, $1) WHERE server_id = $2`,
            [req.session.user.userid, tokenQuery[0].references_server]
        ),
        redisClient.lpush(`servers:${req.session.user.userid}`, tokenQuery[0].references_server)
    ])
    res.status(StatusCodes.OK).json({ server })
}

module.exports = {
    createSingleServer,
    getServerMembers,
    generateInviteToken,
    joinServer
}