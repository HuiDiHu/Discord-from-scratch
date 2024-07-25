const { StatusCodes } = require('http-status-codes')
const pool = require('../db/connect')

const getSingleDMMessages = async (req, res) => {
    const {
        params: { id: channelId }
    } = req;

    const messages = (await pool.query(
        "SELECT * FROM MESSAGES WHERE in_dm = $1",
        [Number(channelId)]
    )).rows.sort((a, b) => b.created_at < a.created_at ? 1 : -1);
    res.status(StatusCodes.OK).json(messages)
}

module.exports = {
    getSingleDMMessages
}