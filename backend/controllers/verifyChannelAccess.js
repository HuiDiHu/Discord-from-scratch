const pool = require('../db/connect')
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, UnauthorizedError } = require('../errors');

const verifyDMAccess = async (req, res, next) => {
    if (!req.session.user) {
        throw new UnauthorizedError("You are not authorized to access this channel.");
    }
    const {
        params: { id: channelId }
    } = req;

    const membersQuery = await pool.query(
        "SELECT members FROM DMS WHERE dm_id = $1",
        [Number(channelId)]
    )
    if (membersQuery.rowCount > 0) {
        if (membersQuery.rows[0].members.indexOf(req.session.user.userid) !== -1) {
            next();
        } else {
            throw new UnauthorizedError("You are not authorized to access this channel.");
        }
    } else {
        res.status(StatusCodes.NOT_FOUND).send("Channel not found.");
    }
}

const verifyServerAccess = async (req, res, next) => {
    if (!req.session.user) {
        throw new UnauthorizedError("You are not authorized to access this channel.");
    }
    const {
        params: { id: in_channel }
    } = req;

    const serverQuery = (await pool.query(
        "SELECT in_server FROM CHANNELS WHERE channel_id = $1",
        [Number(in_channel)]
    ));
    if (serverQuery.rows.length === 0) {
        throw new NotFoundError('Channel not found.')
    }

    members = (await pool.query(
        "SELECT server_members FROM SERVERS WHERE server_id = $1",
        [serverQuery.rows[0].in_server]
    )).rows[0].server_members || [];

    if (members.length > 0) {
        if (members.indexOf(req.session.user.userid) !== -1) {
            next();
        } else {
            throw new UnauthorizedError("You are not authorized to access this channel.");
        }
    } else {
        throw new NotFoundError("Channel not found.")
    }
}

const verifyServerOwnership = async (req, res, next) => {
    if (!req.session.user) {
        throw new UnauthorizedError("You are not authorized to access this server.");
    }
    const server_id = req.body.server_id || req.params.id;

    if (server_id === null || server_id === undefined) throw new NotFoundError("Server not found.");

    const ownerQuery = await pool.query(
        'SELECT server_owner FROM SERVERS WHERE server_id = $1',
        [Number(server_id)]
    )

    if (ownerQuery.rows.length > 0 && ownerQuery.rows[0].server_owner) {
        const server_owner = ownerQuery.rows[0].server_owner;
        if (server_owner === req.session.user.userid) {
            next();
        } else {
            throw new UnauthorizedError("You are not authorized to do this action.")
        }
    } else {
        throw new NotFoundError("Server not found.")
    }
}

module.exports = {
    verifyDMAccess,
    verifyServerAccess,
    verifyServerOwnership
}