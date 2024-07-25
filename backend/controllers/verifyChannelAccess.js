const pool = require('../db/connect')
const { StatusCodes } = require('http-status-codes')

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

module.exports = {
    verifyDMAccess
}