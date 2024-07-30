const pool = require('../db/connect')
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, UnauthenticatedError } = require('../errors');

const verifyDMAccess = async (req, res, next) => {
    if (!req.session.user) {
        res.status(StatusCodes.UNAUTHORIZED).send("You are not authorized to access this channel.");
        return;
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
            res.status(StatusCodes.UNAUTHORIZED).send("You are not authorized to access this channel.");
        }
    } else {
        res.status(StatusCodes.NOT_FOUND).send("Channel not found.");
    }
}

const verifyServerAccess = async (req, res, next) => {
    if (!req.session.user) {
        res.status(StatusCodes.UNAUTHORIZED).send("You are not authorized to access this channel.");
        return;
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
            res.status(StatusCodes.UNAUTHORIZED).send("You are not authorized to access this channel.");
        }
    } else {
        throw new NotFoundError("Channel not found.")
    }
}

module.exports = {
    verifyDMAccess,
    verifyServerAccess
}